const menu = document.querySelector(".menu");
const hamburger = document.querySelector(".hamb");

if (menu && hamburger) {
  const closeMenu = () => {
    menu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  };

  hamburger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeMenu();
    }
  });
}

const animatedElements = document.querySelectorAll(
  ".reveal, .section, .card, .service-tile, .feature",
);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    },
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
} else {
  animatedElements.forEach((element) => {
    element.classList.add("visible");
  });
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll("[data-filter]").forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    document.querySelectorAll("[data-cat]").forEach((card) => {
      const isVisible = filter === "all" || card.dataset.cat === filter;

      card.hidden = !isVisible;
    });
  });
});

const MAKE_WEBHOOK_URL =
  "https://hook.eu1.make.com/xw8e3q0tarpesgw85qirm0doo3npedp2";

const contactForm = document.querySelector("form[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');

    const statusElement = contactForm.querySelector("[data-form-status]");

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const photosInput = contactForm.querySelector('input[name="photos"]');

    const photos = photosInput ? Array.from(photosInput.files || []) : [];

    if (photos.length > 5) {
      if (statusElement) {
        statusElement.textContent = "Můžete přiložit nejvýše 5 souborů.";
      }

      return;
    }

    const originalButtonText = submitButton ? submitButton.textContent : "";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Odesílám…";
    }

    if (statusElement) {
      statusElement.textContent = "";
    }

    try {
      const MAX_WEBHOOK_BYTES = 4.5 * 1024 * 1024;
      const MAX_IMAGE_BYTES = 800 * 1024;

      const compressImage = (file) =>
        new Promise((resolve, reject) => {
          if (!file.type.startsWith("image/")) {
            resolve(file);
            return;
          }

          const image = new Image();
          const objectUrl = URL.createObjectURL(file);

          image.onload = async () => {
            try {
              let width = image.naturalWidth;
              let height = image.naturalHeight;
              const maxSide = 2000;

              if (Math.max(width, height) > maxSide) {
                const scale = maxSide / Math.max(width, height);
                width = Math.round(width * scale);
                height = Math.round(height * scale);
              }

              const canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = height;
              const context = canvas.getContext("2d");
              context.drawImage(image, 0, 0, width, height);

              let quality = 0.82;
              let blob = await new Promise((done) =>
                canvas.toBlob(done, "image/jpeg", quality)
              );

              while (blob && blob.size > MAX_IMAGE_BYTES && quality > 0.5) {
                quality -= 0.08;
                blob = await new Promise((done) =>
                  canvas.toBlob(done, "image/jpeg", quality)
                );
              }

              if (!blob) throw new Error("Image compression failed");

              const baseName = file.name.replace(/\.[^.]+$/, "");
              resolve(
                new File([blob], `${baseName}.jpg`, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
              );
            } catch (error) {
              reject(error);
            } finally {
              URL.revokeObjectURL(objectUrl);
            }
          };

          image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Image could not be loaded"));
          };

          image.src = objectUrl;
        });

      const preparedPhotos = await Promise.all(photos.map(compressImage));
      const totalFileSize = preparedPhotos.reduce((sum, file) => sum + file.size, 0);

      if (totalFileSize > MAX_WEBHOOK_BYTES) {
        throw new Error("FILES_TOO_LARGE");
      }

      const formData = new FormData();

      formData.append("name", contactForm.elements.name.value.trim());
      formData.append("email", contactForm.elements.email.value.trim());
      formData.append("phone", contactForm.elements.phone.value.trim());
      formData.append("projectType", contactForm.elements.projectType.value);
      formData.append("message", contactForm.elements.message.value.trim());
      formData.append("filesCount", String(preparedPhotos.length));

      preparedPhotos.forEach((photo) => {
        // Make exposes multipart uploads under files.<field name>.
        // The existing scenario expects 1.files.files.
        formData.append("files", photo, photo.name);
      });

      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      contactForm.reset();

      if (statusElement) {
        statusElement.textContent = "Děkujeme. Vaše poptávka byla odeslána.";
      }
    } catch (error) {
      console.error("Odeslání formuláře se nezdařilo:", error);

      if (statusElement) {
        statusElement.textContent =
          error && error.message === "FILES_TOO_LARGE"
            ? "Přiložené soubory jsou příliš velké. Zkuste prosím menší fotografie nebo méně souborů."
            : "Poptávku se nepodařilo odeslat. Zkuste to prosím znovu.";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}

const heroSlides = document.querySelectorAll(".hero-slider .hero-bg");

if (heroSlides.length > 1 && !prefersReducedMotion) {
  let heroIndex = 0;

  window.setInterval(() => {
    heroSlides[heroIndex].classList.remove("is-active");

    heroIndex = (heroIndex + 1) % heroSlides.length;

    heroSlides[heroIndex].classList.add("is-active");
  }, 9000);
}

document.querySelectorAll("[data-service-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".service-grid");
  const previousButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");

  if (!track || !previousButton || !nextButton) {
    return;
  }

  const originalCards = Array.from(track.querySelectorAll(".service-tile"));

  if (originalCards.length < 2) {
    previousButton.hidden = true;
    nextButton.hidden = true;
    return;
  }

  const createClone = (card) => {
    const clone = card.cloneNode(true);

    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("tabindex", "-1");

    return clone;
  };

  originalCards
    .slice()
    .reverse()
    .forEach((card) => track.prepend(createClone(card)));

  originalCards.forEach((card) => track.append(createClone(card)));

  const getCardStep = () => {
    const firstCard = track.querySelector(".service-tile");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;

    return firstCard ? firstCard.getBoundingClientRect().width + gap : 0;
  };

  const getCycleWidth = () => getCardStep() * originalCards.length;

  const normalizePosition = () => {
    const cycleWidth = getCycleWidth();

    if (track.scrollLeft < cycleWidth) {
      track.scrollLeft += cycleWidth;
    } else if (track.scrollLeft >= cycleWidth * 2) {
      track.scrollLeft -= cycleWidth;
    }
  };

  previousButton.addEventListener("click", () => {
    track.scrollBy({ left: -getCardStep(), behavior: "smooth" });
  });

  nextButton.addEventListener("click", () => {
    track.scrollBy({ left: getCardStep(), behavior: "smooth" });
  });

  let scrollTimer;

  track.addEventListener(
    "scroll",
    () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(normalizePosition, 100);
    },
    { passive: true },
  );

  const setInitialPosition = () => {
    track.scrollLeft = getCycleWidth();
  };

  window.addEventListener("resize", normalizePosition);
  window.requestAnimationFrame(setInitialPosition);
});

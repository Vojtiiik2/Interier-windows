const menu = document.querySelector('.menu');
const hamburger = document.querySelector('.hamb');

if (menu && hamburger) {
  hamburger.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

const animatedElements = document.querySelectorAll(
  '.reveal, .section, .card, .service-tile, .feature'
);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  animatedElements.forEach(element => {
    observer.observe(element);
  });
} else {
  animatedElements.forEach(element => {
    element.classList.add('visible');
  });
}

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    document.querySelectorAll('[data-filter]').forEach(item => {
      item.classList.remove('active');
    });

    button.classList.add('active');

    document.querySelectorAll('[data-cat]').forEach(card => {
      const isVisible =
        filter === 'all' || card.dataset.cat === filter;

      card.style.display = isVisible ? 'block' : 'none';
    });
  });
});

const MAKE_WEBHOOK_URL =
  'https://hook.eu1.make.com/xw8e3q0tarpesgw85qirm0doo3npedp2';

const contactForm = document.querySelector(
  'form[data-contact-form]'
);

if (contactForm) {
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    const submitButton = contactForm.querySelector(
      'button[type="submit"]'
    );

    const statusElement = contactForm.querySelector(
      '[data-form-status]'
    );

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const photosInput = contactForm.querySelector(
      'input[name="photos"]'
    );

    const photos = photosInput
      ? Array.from(photosInput.files || [])
      : [];

    if (photos.length > 5) {
      if (statusElement) {
        statusElement.textContent =
          'Můžete přiložit nejvýše 5 souborů.';
      }

      return;
    }

    const originalButtonText = submitButton
      ? submitButton.textContent
      : '';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Odesílám…';
    }

    if (statusElement) {
      statusElement.textContent = '';
    }

    try {
      const formData = new FormData();

      formData.append(
        'name',
        contactForm.elements.name.value.trim()
      );

      formData.append(
        'email',
        contactForm.elements.email.value.trim()
      );

      formData.append(
        'phone',
        contactForm.elements.phone.value.trim()
      );

      formData.append(
        'projectType',
        contactForm.elements.projectType.value
      );

      formData.append(
        'message',
        contactForm.elements.message.value.trim()
      );

      photos.forEach(photo => {
        formData.append(
          'photos',
          photo,
          photo.name
        );
      });

      await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });

      contactForm.reset();

      if (statusElement) {
        statusElement.textContent =
          'Děkujeme. Vaše poptávka byla odeslána.';
      }
    } catch (error) {
      console.error(
        'Odeslání formuláře se nezdařilo:',
        error
      );

      if (statusElement) {
        statusElement.textContent =
          'Poptávku se nepodařilo odeslat. Zkuste to prosím znovu.';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}

const heroSlides = document.querySelectorAll(
  '.hero-slider .hero-bg'
);

if (heroSlides.length > 1) {
  let heroIndex = 0;

  window.setInterval(() => {
    heroSlides[heroIndex].classList.remove('is-active');

    heroIndex = (heroIndex + 1) % heroSlides.length;

    heroSlides[heroIndex].classList.add('is-active');
  }, 9000);
}

const menu = document.querySelector('.menu');
const hamb = document.querySelector('.hamb');

if (hamb && menu) {
  hamb.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

const io = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

document
  .querySelectorAll('.reveal, .section, .card, .service-tile, .feature')
  .forEach(element => {
    io.observe(element);
  });

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    document.querySelectorAll('[data-filter]').forEach(item => {
      item.classList.remove('active');
    });

    button.classList.add('active');

    document.querySelectorAll('[data-cat]').forEach(card => {
      card.style.display =
        filter === 'all' || card.dataset.cat === filter
          ? 'block'
          : 'none';
    });
  });
});

const MAKE_WEBHOOK_URL =
  'https://hook.eu1.make.com/xw8e3q0tarpesgw85qirm0doo3npedp2';

const form = document.querySelector('form[data-demo]');

if (form) {
  form.addEventListener('submit', async event => {
    event.preventDefault();

    const nameInput = form.querySelector(
      '[name="name"]'
    );

    const emailInput = form.querySelector(
      '[name="email"]'
    );

    const phoneInput = form.querySelector(
      '[name="phone"]'
    );

    const messageInput = form.querySelector(
      '[name="message"]'
    );

    const filesInput = form.querySelector(
      'input[type="file"]'
    );

    const submitButton = form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    const name = nameInput
      ? nameInput.value.trim()
      : '';

    const email = emailInput
      ? emailInput.value.trim()
      : '';

    const phone = phoneInput
      ? phoneInput.value.trim()
      : '';

    const message = messageInput
      ? messageInput.value.trim()
      : '';

    const files = filesInput
      ? Array.from(filesInput.files || []).slice(0, 5)
      : [];

    const validName =
      name.length >= 2;

    const validEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validPhone =
      phone.length >= 6;

    const validMessage =
      message.length >= 5;

    if (
      !validName ||
      !validEmail ||
      !validPhone ||
      !validMessage
    ) {
      alert(
        'Zkontrolujte prosím vyplněné údaje. Jméno, e-mail, telefon a zpráva jsou povinné.'
      );

      return;
    }

    const originalButtonText =
      submitButton && submitButton.tagName === 'BUTTON'
        ? submitButton.textContent
        : submitButton
          ? submitButton.value
          : '';

    if (submitButton) {
      submitButton.disabled = true;

      if (submitButton.tagName === 'BUTTON') {
        submitButton.textContent = 'Odesílám…';
      } else {
        submitButton.value = 'Odesílám…';
      }
    }

    try {
      const formData = new FormData();

      formData.append(
        'name',
        name
      );

      formData.append(
        'email',
        email
      );

      formData.append(
        'phone',
        phone
      );

      formData.append(
        'message',
        message
      );

      formData.append(
        'filesCount',
        String(files.length)
      );

      files.forEach(file => {
        formData.append(
          'files',
          file,
          file.name
        );
      });

      await fetch(
        MAKE_WEBHOOK_URL,
        {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        }
      );

      form.reset();

      alert(
        'Děkujeme. Vaše poptávka byla úspěšně odeslána.'
      );
    } catch (error) {
      console.error(
        'Chyba při odesílání formuláře:',
        error
      );

      alert(
        'Poptávku se nepodařilo odeslat. Zkuste to prosím znovu nebo nás kontaktujte e-mailem.'
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;

        if (submitButton.tagName === 'BUTTON') {
          submitButton.textContent =
            originalButtonText;
        } else {
          submitButton.value =
            originalButtonText;
        }
      }
    }
  });
}

// Decentní hero slider bez ovládacích prvků
const heroSlides = document.querySelectorAll(
  '.hero-slider .hero-bg'
);

if (heroSlides.length > 1) {
  let heroIndex = 0;

  setInterval(() => {
    heroSlides[
      heroIndex
    ].classList.remove('is-active');

    heroIndex =
      (heroIndex + 1) %
      heroSlides.length;

    heroSlides[
      heroIndex
    ].classList.add('is-active');
  }, 9000);
}

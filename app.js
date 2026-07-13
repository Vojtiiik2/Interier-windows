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

    const submitButton = form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    const originalButtonText = submitButton
      ? submitButton.textContent
      : '';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Odesílám…';
    }

    try {
      const formData = new FormData(form);

      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Webhook vrátil chybu ${response.status}`);
      }

      alert('Děkujeme. Vaše poptávka byla úspěšně odeslána.');

      form.reset();
    } catch (error) {
      console.error('Chyba při odesílání formuláře:', error);

      alert(
        'Poptávku se nepodařilo odeslat. Zkuste to prosím znovu nebo nás kontaktujte e-mailem.'
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
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
    heroSlides[heroIndex].classList.remove('is-active');

    heroIndex = (heroIndex + 1) % heroSlides.length;

    heroSlides[heroIndex].classList.add('is-active');
  }, 9000);
}

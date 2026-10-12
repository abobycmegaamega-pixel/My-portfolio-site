
const animatedElements = document.querySelectorAll(
  '.project-card, .service-card, .about-content, .contact-section'
);

animatedElements.forEach((element) => {
  element.classList.add('reveal');
});

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
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

animatedElements.forEach((element) => {
  observer.observe(element);
});


// Форма заказа сайта
const orderModal = document.querySelector('#orderModal');
const orderForm = document.querySelector('#orderForm');
const orderService = document.querySelector('#orderService');
const orderStatus = document.querySelector('#orderStatus');
const firstOrderField = document.querySelector('#orderName');
let previousFocus = null;

function openOrderModal(service) {
  if (!orderModal || !orderService) return;
  previousFocus = document.activeElement;
  if (service && [...orderService.options].some((option) => option.value === service)) {
    orderService.value = service;
  }
  if (orderStatus) orderStatus.textContent = '';
  orderModal.classList.add('open');
  orderModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('order-open');
  window.setTimeout(() => firstOrderField?.focus(), 0);
}

function closeOrderModal() {
  if (!orderModal) return;
  orderModal.classList.remove('open');
  orderModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('order-open');
  previousFocus?.focus();
}

document.querySelectorAll('.order-button').forEach((button) => {
  button.addEventListener('click', () => openOrderModal(button.dataset.service));
});

document.querySelectorAll('[data-order-close]').forEach((button) => {
  button.addEventListener('click', closeOrderModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && orderModal?.classList.contains('open')) {
    closeOrderModal();
  }
});

orderForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!orderForm.reportValidity()) return;

  const formData = new FormData(orderForm);
  const service = String(formData.get('service') || '');
  const name = String(formData.get('name') || '').trim();
  const details = String(formData.get('details') || '').trim();
  const contact = String(formData.get('contact') || '').trim();

  const message = [
    'Заявка на создание сайта',
    '',
    `Услуга: ${service}`,
    `Имя или никнейм: ${name}`,
    `Описание идеи: ${details}`,
    `Контакт для ответа: ${contact}`
  ].join('\\n');

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(message);
      if (orderStatus) {
        orderStatus.textContent = 'Заявка скопирована! Теперь открой Telegram или почту и отправь это сообщение.';
      }
    } else {
      const temporary = document.createElement('textarea');
      temporary.value = message;
      temporary.setAttribute('readonly', '');
      temporary.style.position = 'fixed';
      temporary.style.opacity = '0';
      document.body.appendChild(temporary);
      temporary.select();
      const copied = document.execCommand('copy');
      temporary.remove();
      if (orderStatus) {
        orderStatus.textContent = copied
          ? 'Заявка скопирована! Отправь сообщение через Telegram или почту.'
          : 'Не получилось скопировать автоматически. Напиши через кнопки контактов ниже.';
      }
    }
  } catch (error) {
    if (orderStatus) {
      orderStatus.textContent = 'Не получилось скопировать автоматически. Напиши через кнопки контактов ниже.';
    }
  }
});

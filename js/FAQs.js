document.addEventListener('DOMContentLoaded', () => {
  const faqData = [
    {
      id: 1,
      question: "Cuanto tiempo tarda en llegar mi pedido?",
      answer: "Los tiempos estándar de entrega son de 2 a 3 días hábiles en envíos locales o nacionales, puedes usar tu número de guía para rastreo.",
      icon: "🚚📦",
      iconPosition: "right"
    },
    {
      id: 2,
      question: "Qué formas de pago aceptan?",
      answer: "Se aceptan tarjetas de crédito/débito y depósitos bancarios.",
      icon: "💸",
      iconPosition: "right"
    },
    {
      id: 3,
      question: "Cómo saber qué alimento elegir para mi mascota? ",
      answer: "Puedes consultar las recomendaciones de nuestro equipo de expertos en nutrición animal o revisar las etiquetas de los productos para elegir el alimento adecuado para tu mascota.",
    },
    
  ];

  const container = document.getElementById('faq-accordion');
  if (!container) return;

  faqData.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'faq-item';

    // Manejo de iconos a la izquierda o derecha
    const iconLeft = (item.icon && item.iconPosition === 'left') ? `<span>${item.icon}</span> ` : '';
    const iconRight = (item.icon && item.iconPosition === 'right') ? ` <span>${item.icon}</span>` : '';

    itemEl.innerHTML = `
      <button class="faq-question" type="button" aria-expanded="false">
        ${iconLeft}<span>${item.question}</span>${iconRight}
      </button>
      <div class="faq-answer-wrapper">
        <div class="faq-answer">
          ${item.answer}
        </div>
      </div>
    `;

    const button = itemEl.querySelector('.faq-question');
    const answerWrapper = itemEl.querySelector('.faq-answer-wrapper');

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      //cierra los demás acordeones
      document.querySelectorAll('.faq-question').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.faq-answer-wrapper').forEach(wrapper => {
        wrapper.style.maxHeight = null;
      });

      
      if (!isExpanded) {
        button.setAttribute('aria-expanded', 'true');
        answerWrapper.style.maxHeight = answerWrapper.scrollHeight + 'px';
      }
    });

    container.appendChild(itemEl);
  });
});
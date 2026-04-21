const observerOptions = {
  threshold: 0.08,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Usa o índice armazenado no dataset para garantir delay escalonado correto
      const index = parseInt(entry.target.dataset.cardIndex || "0", 10);
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, index * 60);

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".section-card");
  cards.forEach((card, index) => {
    // Armazena o índice no elemento para uso dentro do callback do observer
    card.dataset.cardIndex = index;
    observer.observe(card);
  });
});

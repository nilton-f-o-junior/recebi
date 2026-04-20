/**
 * utils.js - Funções utilitárias
 * Recebi - Gerador de Recibo Online
 */

// Formata um valor para moeda brasileira (R$)
function formatCurrency(value) {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Formata uma data para o padrão brasileiro (ex: "16 de abril de 2026")
function formatDateLong(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Formata data e hora atual em português
function getCurrentDateTimeBR() {
  return new Date().toLocaleString("pt-BR");
}

// Gera nome de arquivo para impressão
function generateFileName(data) {
  const rawDate = data.issueDate || "";
  const [y, m, d] = rawDate.split("-");
  const dateStr = d && m && y ? `${d}.${m}.${y}` : rawDate;

  const clientName = (data.clientName || "").trim();
  const carModel = (data.carModel || "").trim();

  const parts = [dateStr, clientName, carModel].filter(Boolean);
  return parts.join(" - ") || "Recibo";
}

// Verifica se uma string está vazia
function isEmpty(str) {
  return !str || str.trim().length === 0;
}

// Escapa HTML para prevenir XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Debounce para otimizar eventos frequentes
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Exportar para uso em outros módulos
window.Utils = {
  formatCurrency,
  formatDateLong,
  getCurrentDateTimeBR,
  generateFileName,
  isEmpty,
  escapeHtml,
  debounce,
};
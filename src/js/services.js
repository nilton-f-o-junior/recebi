/**
 * services.js - Gestão de Serviços/Produtos
 * Recebi - Gerador de Recibo Online
 */

let serviceCounter = 0;

/**
 * Adiciona uma nova linha de serviço
 * @param {boolean} first - Se é a primeira linha (não remove o label)
 */
function addService(first = false) {
  serviceCounter++;
  const container = document.getElementById("servicesContainer");
  const div = document.createElement("div");
  div.className = "service-row";
  div.id = `service-row-${serviceCounter}`;
  div.innerHTML = `
        <div class="field">
            ${first ? "<label>Serviço / Produto</label>" : ""}
            <input type="text" name="serviceName[]" placeholder="Descrição" required data-testid="input-service-name">
        </div>
        <div class="field">
            ${first ? "<label>Valor (R$)</label>" : ""}
            <input type="number" step="0.01" name="serviceValue[]" placeholder="0,00" required oninput="Services.updateTotal(); updateProgress();" data-testid="input-service-value">
        </div>
        <button type="button" class="btn-remove" onclick="Services.removeService(this.parentElement)" data-testid="btn-remove-service">×</button>
    `;
  container.appendChild(div);
}

/**
 * Exibe o campo de desconto
 */
function addDiscount() {
  const container = document.getElementById("discountContainer");
  if (container) {
    container.style.display = "block";
  }
}

/**
 * Remove uma linha de serviço
 * @param {HTMLElement} rowElement
 */
function removeService(rowElement) {
  const container = document.getElementById("servicesContainer");
  const rows = container.querySelectorAll(".service-row");

  // Não remove se for a única linha
  if (rows.length <= 1) return;

  rowElement.remove();
  updateProgress();
}

/**
 * Atualiza o total dos serviços e a barra de progresso
 */
function updateServiceTotal() {
  Form.updateProgress();
}

/**
 * Obtém todos os serviços do formulário
 * @returns {Array<{name: string, value: number}>}
 */
function getServices() {
  const container = document.getElementById("servicesContainer");
  const rows = container.querySelectorAll(".service-row");
  const services = [];

  rows.forEach((row) => {
    const nameInput = row.querySelector('input[name="serviceName[]"]');
    const valueInput = row.querySelector('input[name="serviceValue[]"]');
    if (nameInput && valueInput && nameInput.value.trim()) {
      services.push({
        name: nameInput.value.trim(),
        value: parseFloat(valueInput.value) || 0,
      });
    }
  });

  return services;
}

/**
 * Calcula o total de todos os serviços
 * @returns {number}
 */
function calculateTotal() {
  const services = getServices();
  let subtotal = services.reduce((sum, service) => sum + service.value, 0);

  const discountInput = document.getElementById("discountValue");
  const discountPercent = parseFloat(discountInput?.value) || 0;
  const discountAmount = subtotal * (discountPercent / 100);
  
  let total = subtotal - discountAmount;

  return total < 0 ? 0 : total;
}

/**
 * Verifica se há pelo menos um serviço válido
 * @returns {boolean}
 */
function hasValidService() {
  const services = getServices();
  return services.some((s) => s.name && s.value > 0);
}

// Exportar para uso em outros módulos
window.Services = {
  addService,
  removeService,
  updateServiceTotal,
  getServices,
  calculateTotal,
  hasValidService,
  updateTotal: updateServiceTotal,
  addDiscount,
};
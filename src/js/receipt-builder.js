/**
 * receipt-builder.js - Montagem do HTML do Recibo
 * Recebi - Gerador de Recibo Online
 */

/**
 * Gera o HTML do recibo a partir dos dados do formulário
 * @param {Object} data - Dados do formulário
 * @param {string} resolvedLogo - Logo em Base64 ou URL
 * @returns {string} HTML do recibo
 */
function buildReceiptHTML(data, resolvedLogo) {
  // Alias local para escapeHtml — previne XSS em todos os dados do usuário
  const e = Utils.escapeHtml;

  // Coletar dados do formulário diretamente
  const form = document.getElementById("receiptForm");
  const fd = new FormData(form);

  const serviceNames = fd.getAll("serviceName[]");
  const serviceValues = fd.getAll("serviceValue[]");

  // Montar linhas de serviços
  let servicesRows = "";
  let total = 0;
  serviceNames.forEach((name, i) => {
    const val = parseFloat(serviceValues[i]) || 0;
    total += val;
    servicesRows += `
            <tr>
                <td class="receipt-table-cell">${e(name)}</td>
                <td class="receipt-table-cell receipt-table-cell--right">R$ ${val.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}</td>
            </tr>`;
  });

  // Formatar data de emissão
  const issueDate = new Date(data.issueDate + "T12:00:00").toLocaleDateString("pt-BR");
  const now = new Date().toLocaleString("pt-BR");

  // Obter estado selecionado
  const stateSelect = document.getElementById("estStateSelect");
  const stateValue = stateSelect.options[stateSelect.selectedIndex]?.value || "";

  // Montar endereço do estabelecimento
  const estAddress = [
    data.estStreet,
    data.estNumber,
    data.estNeighborhood,
    data.estCity,
    stateValue,
  ]
    .filter(Boolean)
    .join(", ");

  // Escolher estilo do rodapé
  const footerStyle = data.footerStyle || "minimal";

  const footerHtml =
    footerStyle === "minimal"
      ? `
        <div class="receipt-footer-signature-email">
          <div class="receipt-footer-sig-inner">
            ${resolvedLogo ? `<img src="${resolvedLogo}" alt="Logo" class="receipt-footer-sig-logo" onerror="this.style.display='none'">` : ""}
            ${resolvedLogo ? `<div class="receipt-footer-sig-divider"></div>` : ""}
            <div class="receipt-footer-sig-info">
              <p class="receipt-footer-sig-name">${e(data.estName)}</p>
              ${data.providerDoc ? `<p class="receipt-footer-sig-detail"><span>CPF/CNPJ:</span> ${e(data.providerDoc)}</p>` : ""}
              ${data.providerPhone ? `<p class="receipt-footer-sig-detail"><span>Telefone:</span> ${e(data.providerPhone)}</p>` : ""}
              ${estAddress ? `<p class="receipt-footer-sig-detail"><span>Localizado:</span> ${e(estAddress)}</p>` : ""}
            </div>
          </div>
          <p class="receipt-footer-timestamp">Documento emitido em ${now}</p>
        </div>`
      : `
            <div class="receipt-footer-signatures">
                <div class="receipt-signature-block">
                    <div class="receipt-signature-line">
                        <p class="receipt-signature-name">${e(data.providerName)}</p>
                        <p class="receipt-signature-role">Assinatura do Beneficiário</p>
                    </div>
                </div>
                <div class="receipt-signature-block">
                    <div class="receipt-signature-line">
                        <p class="receipt-signature-name">${e(data.clientName)}</p>
                        <p class="receipt-signature-role">Assinatura do Cliente</p>
                    </div>
                </div>
            </div>
            <p class="receipt-footer-timestamp">Gerado em ${now} — Recebi</p>`;

  // Montar HTML final
  const html = `
        <div class="receipt-wrapper">
            <div class="receipt-header">
                <div class="receipt-header-left">
                    ${resolvedLogo ? `<img src="${resolvedLogo}" alt="Logo da empresa" class="receipt-logo" onerror="this.style.display='none'">` : ""}
                    <div>
                        <p class="receipt-type">${e(data.receiptType)}</p>
                        <h1 class="receipt-est-name">${e(data.estName)}</h1>
                        <p class="receipt-est-address">${e([data.estStreet, data.estNumber].filter(Boolean).join(", "))}${data.estNeighborhood ? " — " + e(data.estNeighborhood) : ""}</p>
                    </div>
                </div>
                <div class="receipt-header-right">
                    <p class="receipt-date-label">Emissão</p>
                    <p class="receipt-date-value">${issueDate}</p>
                    <p class="receipt-city">${e(data.estCity || "")}${stateValue ? ", " + e(stateValue) : ""}</p>
                </div>
            </div>
            <div class="receipt-body">
                <div class="receipt-parties">
                    <div class="receipt-party-card">
                        <p class="receipt-section-label">Cliente</p>
                        <p class="receipt-party-name">${e(data.clientName)}</p>
                        <p class="receipt-party-detail">${e(data.clientDoc)}</p>
                        ${data.clientPhone ? `<p class="receipt-party-detail">${e(data.clientPhone)}</p>` : ""}
                    </div>
                    <div class="receipt-party-card">
                        <p class="receipt-section-label">Beneficiário</p>
                        <p class="receipt-party-name">${e(data.providerName)}</p>
                        <p class="receipt-party-detail">${e(data.providerDoc)}</p>
                        ${data.providerPhone ? `<p class="receipt-party-detail">${e(data.providerPhone)}</p>` : ""}
                    </div>
                </div>
                ${
                  data.carModel
                    ? `
                <div class="receipt-vehicle-card">
                    <p class="receipt-vehicle-label">Veículo</p>
                    <div class="receipt-vehicle-info">
                        <span><strong>Modelo:</strong> ${e(data.carModel)}</span>
                        ${data.carPlate ? `<span><strong>Placa:</strong> ${e(data.carPlate)}</span>` : ""}
                        ${data.carYear ? `<span><strong>Ano:</strong> ${e(data.carYear)}</span>` : ""}
                    </div>
                </div>`
                    : ""
                }
                <table class="receipt-table">
                    <thead>
                        <tr>
                            <th class="receipt-table-header receipt-table-header--left">Descrição</th>
                            <th class="receipt-table-header receipt-table-header--right">Valor</th>
                        </tr>
                    </thead>
                    <tbody>${servicesRows}</tbody>
                </table>
                <div class="receipt-total-wrapper">
                    <div class="receipt-total-box">
                        <p class="receipt-total-label">Total</p>
                        <p class="receipt-total-value">R$ ${total.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}</p>
                    </div>
                </div>
                ${
                  data.observations
                    ? `
                <div class="receipt-observations">
                    <p class="receipt-observations-label">Observações</p>
                    <p class="receipt-observations-text">${e(data.observations)}</p>
                </div>`
                    : ""
                }
                ${footerHtml}
            </div>
        </div>`;

  return html;
}

/**
 * Exibe o recibo no modal de preview
 * @param {string} html - HTML do recibo
 */
function showReceiptPreview(html) {
  document.getElementById("receiptContent").innerHTML = html;
  const container = document.getElementById("printContainer");
  container.classList.add("visible");
  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0);

  // Move foco para o primeiro botão de ação do modal — SDD §5.6
  const firstBtn = container.querySelector(".print-actions button");
  if (firstBtn) {
    // Aguarda o próximo frame para garantir que o elemento está visível
    requestAnimationFrame(() => firstBtn.focus());
  }

  // Anuncia para leitores de tela — SDD §5.7
  const live = document.getElementById("a11yLive");
  if (live)
    live.textContent =
      "Recibo gerado com sucesso. Use os botões abaixo para imprimir ou fechar.";
}

/**
 * Fecha o modal de preview
 */
function closePreview() {
  document.getElementById("printContainer").classList.remove("visible");
  document.body.style.overflow = "";
}

// Exportar para uso em outros módulos
window.ReceiptBuilder = {
  buildReceiptHTML,
  showReceiptPreview,
  closePreview,
};
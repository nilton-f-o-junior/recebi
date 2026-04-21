/**
 * form.js - Controle do Formulário Principal
 * Recebi - Gerador de Recibo Online
 */

/**
 * Atualiza a barra de progresso do formulário
 */
function updateProgress() {
  const form = document.getElementById("receiptForm");
  const required = form.querySelectorAll("input[required]");
  let filled = 0;
  required.forEach((i) => {
    if (i.value.trim()) filled++;
  });
  const fill = document.getElementById("stepFill");
  if (fill) {
    fill.style.width = (filled / required.length) * 100 + "%";
  }
}

/**
 * Fecha o preview do recibo
 */
function closePreview() {
  ReceiptBuilder.closePreview();
}

/**
 * Imprime o recibo com nome de arquivo dinâmico
 */
function printReceipt() {
  const fd = new FormData(document.getElementById("receiptForm"));
  const data = Object.fromEntries(fd.entries());

  const title = Utils.generateFileName(data);
  const original = document.title;
  document.title = title;
  window.print();
  // Restaura o título após o diálogo de impressão fechar
  setTimeout(() => {
    document.title = original;
  }, 1000);
}

/**
 * Inicializa o formulário
 */
function initForm() {
  // Pré-preencher data atual
  const dateInput = document.querySelector('input[name="issueDate"]');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split("T")[0];
  }

  // Adicionar primeiro serviço
  Services.addService(true);

  // Atualizar progresso
  updateProgress();

  // Inicializar dropzone de logo
  Logo.initLogoDropZone();

  // Configurar abas de logo
  document.getElementById("panelUpload").style.display = "block";
  document.getElementById("panelUrl").style.display = "none";
}

/**
 * Handler para submit do formulário
 * @param {SubmitEvent} e
 */
function handleFormSubmit(e) {
  e.preventDefault();

  // Validação de campos obrigatórios — SDD §3.11
  let firstInvalid = null;

  function markField(id, condition, errId, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    const errEl = errId ? document.getElementById(errId) : null;
    if (!condition) {
      el.classList.add("field-invalid");
      if (errEl) {
        errEl.textContent = msg || errEl.textContent;
        errEl.classList.add("visible");
      }
      if (!firstInvalid) firstInvalid = el;
    } else {
      el.classList.remove("field-invalid");
      if (errEl) errEl.classList.remove("visible");
    }
    return condition;
  }

  const fd = new FormData(e.target);
  const d = Object.fromEntries(fd.entries());

  // Validar campos
  markField("receiptType", d.receiptType && d.receiptType !== "", null, "");
  markField("issueDate", !!d.issueDate, null, "");
  markField(
    "clientName",
    d.clientName?.trim().length >= 3,
    "clientNameErr",
    "Mínimo 3 caracteres"
  );
  markField(
    "clientPhone",
    /^\(\d{2}\) \d{4,5}-\d{4}$/.test(d.clientPhone || ""),
    "clientPhoneErr",
    "Celular inválido"
  );
  markField(
    "providerName",
    d.providerName?.trim().length >= 3,
    "providerNameErr",
    "Mínimo 3 caracteres"
  );
  markField(
    "carModel",
    d.carModel?.trim().length >= 2,
    "carModelErr",
    "Mínimo 2 caracteres"
  );
  markField(
    "carYear",
    /^\d{4}$/.test(d.carYear || "") &&
      +d.carYear >= 1900 &&
      +d.carYear <= new Date().getFullYear() + 1,
    "carYearErr",
    "Ano inválido"
  );
  markField(
    "estName",
    d.estName?.trim().length > 0,
    "estNameErr",
    "Campo obrigatório"
  );
  markField("estStateSelect", !!d.estState, null, "");
  markField("estCitySelect", !!d.estCity, null, "");
  markField("estNeighborhood", d.estNeighborhood?.trim().length > 0, null, "");
  markField("estStreet", d.estStreet?.trim().length > 0, null, "");
  markField("estNumber", d.estNumber?.trim().length > 0, null, "");
  markField("estCep", /^\d{5}-\d{3}$/.test(d.estCep || ""), null, "");

  // Validar serviços
  const names = fd.getAll("serviceName[]");
  const values = fd.getAll("serviceValue[]");
  const hasService = names.some(
    (n, i) => n.trim() && parseFloat(values[i]) > 0
  );
  if (!hasService && !firstInvalid) {
    const btn = document.querySelector(".btn-add");
    if (btn) firstInvalid = btn;
  }

  // Validar CPF/CNPJ se preenchido
  if (d.clientDoc) {
    const n = d.clientDoc.replace(/\D/g, "");
    if (n.length === 11 && !Validator.validateCpf(n)) {
      document.getElementById("clientDocErr")?.classList.add("visible");
      if (!firstInvalid) firstInvalid = document.getElementById("clientDoc");
    }
  }
  if (d.providerDoc) {
    const n = d.providerDoc.replace(/\D/g, "");
    if (n.length === 14 && !Validator.validateCnpj(n)) {
      document.getElementById("providerDocErr")?.classList.add("visible");
      if (!firstInvalid) firstInvalid = document.getElementById("providerDoc");
    }
  }

  // Se há campos inválidos, scroll até o primeiro
  if (firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    firstInvalid.focus();
    return;
  }

  // Obter logo
  const resolvedLogo = Logo.getResolvedLogo(d);

  // Estado de loading no botão
  const submitBtn = document.querySelector(".btn-submit");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Gerando...";
  }

  // Construir e exibir recibo
  try {
    const html = ReceiptBuilder.buildReceiptHTML(d, resolvedLogo);
    ReceiptBuilder.showReceiptPreview(html);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Gerar Recibo Agora";
    }
  }
}

/**
 * Inicializa validação em tempo real
 */
function initValidation() {
  const form = document.getElementById("receiptForm");

  // Validação em blur
  form.addEventListener(
    "blur",
    (e) => {
      const el = e.target;
      if (
        !el.hasAttribute("required") &&
        el.type !== "text" &&
        el.type !== "tel"
      )
        return;
      if (el.value.trim()) {
        el.classList.remove("field-invalid");
        const errEl = document.getElementById(el.id + "Err");
        if (errEl) errEl.classList.remove("visible");
      }
    },
    true
  );

  // Validação em input
  form.addEventListener("input", (e) => {
    const el = e.target;
    if (el.value.trim()) {
      el.classList.remove("field-invalid");
      const errEl = document.getElementById(el.id + "Err");
      if (errEl) errEl.classList.remove("visible");
    }
    updateProgress();
  });
}

// Exportar para uso em outros módulos
window.Form = {
  initForm,
  initValidation,
  handleFormSubmit,
  updateProgress,
  closePreview,
  printReceipt,
};
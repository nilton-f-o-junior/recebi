// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('input[name="issueDate"]').value = new Date()
    .toISOString()
    .split("T")[0];
  addService(true);
  updateProgress();
  initLogoDropZone();
  document.getElementById("panelUpload").style.display = "block";
  document.getElementById("panelUrl").style.display = "none";
});

let logoDataUrl = "";
let logoMode = "upload";

// --- LOGO ---
function switchLogoTab(mode) {
  logoMode = mode;
  document
    .getElementById("tabUpload")
    .classList.toggle("active", mode === "upload");
  document.getElementById("tabUrl").classList.toggle("active", mode === "url");
  document.getElementById("panelUpload").style.display =
    mode === "upload" ? "block" : "none";
  document.getElementById("panelUrl").style.display =
    mode === "url" ? "block" : "none";
}

function sanitizeSvgDataUrl(dataUrl) {
  if (!dataUrl.startsWith("data:image/svg")) return dataUrl;
  try {
    const base64 = dataUrl.split(",")[1];
    let svg = atob(base64);
    // Remove tags e atributos perigosos — SDD §8
    svg = svg.replace(/<script[\s\S]*?<\/script>/gi, "");
    svg = svg.replace(/\son\w+="[^"]*"/gi, "");
    svg = svg.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, "");
    return "data:image/svg+xml;base64," + btoa(svg);
  } catch {
    return dataUrl;
  }
}

function applyLogoFile(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Por favor, selecione um arquivo de imagem válido.");
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    alert("A imagem deve ter no máximo 2 MB.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    logoDataUrl = sanitizeSvgDataUrl(e.target.result);
    document.getElementById("logoPreviewImg").src = logoDataUrl;
    document.getElementById("logoPlaceholder").style.display = "none";
    document.getElementById("logoPreviewArea").style.display = "block";
    document.getElementById("logoDropArea").classList.add("has-image");
    document.getElementById("logoFileInput").style.pointerEvents = "none";
  };
  reader.readAsDataURL(file);
}

function handleLogoFile(input) {
  applyLogoFile(input.files[0]);
}

function clearLogo(e) {
  e.preventDefault();
  e.stopPropagation();
  logoDataUrl = "";
  const fileInput = document.getElementById("logoFileInput");
  fileInput.value = "";
  fileInput.style.pointerEvents = "auto";
  document.getElementById("logoPreviewImg").src = "";
  document.getElementById("logoPlaceholder").style.display = "block";
  document.getElementById("logoPreviewArea").style.display = "none";
  document.getElementById("logoDropArea").classList.remove("has-image");
}

function initLogoDropZone() {
  const dropArea = document.getElementById("logoDropArea");

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.add("drag-over");
  });

  dropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropArea.classList.remove("drag-over");
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    applyLogoFile(file);
  });
}

// --- LOCALIDADES (IBGE) ---
async function loadCities(stateCode) {
  const citySelect = document.getElementById("estCitySelect");
  if (!stateCode) {
    citySelect.innerHTML =
      '<option value="">Selecione o estado primeiro</option>';
    citySelect.disabled = true;
    return;
  }
  citySelect.innerHTML = '<option value="">Carregando cidades...</option>';
  citySelect.disabled = true;

  try {
    const res = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}/municipios?orderBy=nome`,
    );
    const cities = await res.json();
    citySelect.innerHTML = '<option value="">Selecione a cidade</option>';
    cities.forEach((city) => {
      const opt = document.createElement("option");
      opt.value = city.nome;
      opt.textContent = city.nome;
      citySelect.appendChild(opt);
    });
    citySelect.disabled = false;
  } catch (err) {
    citySelect.innerHTML = '<option value="">Erro ao carregar</option>';
  }
}

// --- CEP (ViaCEP) ---
async function fetchCep(cep) {
  const clean = cep.replace(/\D/g, "");
  if (clean.length !== 8) return;

  const spinner = document.getElementById("cepSpinner");
  const success = document.getElementById("cepSuccess");
  spinner.style.display = "inline";

  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    const data = await res.json();
    if (data.erro) {
      spinner.style.display = "none";
      return;
    }

    const streetEl = document.getElementById("estStreet");
    const neighEl = document.getElementById("estNeighborhood");
    if (data.logradouro) streetEl.value = data.logradouro;
    if (data.bairro) neighEl.value = data.bairro;

    const stateSelect = document.getElementById("estStateSelect");
    if (data.uf) {
      stateSelect.value = data.uf;
      await loadCities(data.uf);
      const citySelect = document.getElementById("estCitySelect");
      if (data.localidade) citySelect.value = data.localidade;
    }

    spinner.style.display = "none";
    success.style.display = "inline";
    setTimeout(() => {
      success.style.display = "none";
    }, 3000);
  } catch (err) {
    spinner.style.display = "none";
  }
}

// --- MÁSCARAS ---
function maskCpfCnpj(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 14);
  if (v.length <= 11) {
    v = v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    v = v
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
  input.value = v;
}

function maskPhone(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/(\d{2})(\d)/, "($1) $2");
  if (v.length > 13) v = v.replace(/(\d{5})(\d)/, "$1-$2");
  else v = v.replace(/(\d{4})(\d)/, "$1-$2");
  input.value = v;
}

function formatCep(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 8);
  if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5);
  input.value = v;
}

function maskYear(input) {
  input.value = input.value.replace(/\D/g, "").slice(0, 4);
}

function maskPlate(input) {
  let v = input.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7);
  if (v.length > 3) v = v.slice(0, 3) + "-" + v.slice(3);
  input.value = v;
}

// --- VALIDAÇÃO ---
function validateDoc(input, errId) {
  const n = input.value.replace(/\D/g, "");
  if (!n) {
    // campo vazio é aceitável — CPF/CNPJ é opcional
    input.classList.remove("field-invalid");
    document.getElementById(errId)?.classList.remove("visible");
    return;
  }
  const ok =
    n.length === 11
      ? validateCpf(n)
      : n.length === 14
        ? validateCnpj(n)
        : false;
  input.classList.toggle("field-invalid", !ok);
  document.getElementById(errId)?.classList.toggle("visible", !ok);
}

function validateCpf(n) {
  if (n.length !== 11 || /^(\d)\1+$/.test(n)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += +n[i] * (10 - i);
  let r = (s * 10) % 11;
  if (r >= 10) r = 0;
  if (r !== +n[9]) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += +n[i] * (11 - i);
  r = (s * 10) % 11;
  if (r >= 10) r = 0;
  return r === +n[10];
}

function validateCnpj(n) {
  if (n.length !== 14 || /^(\d)\1+$/.test(n)) return false;
  const calc = (ns, len) => {
    let s = 0,
      p = len - 7;
    for (let i = len; i >= 1; i--) {
      s += +ns[len - i] * p--;
      if (p < 2) p = 9;
    }
    const r = s % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(n, 12) === +n[12] && calc(n, 13) === +n[13];
}

// --- VALIDAÇÃO EM TEMPO REAL (on-blur / on-input) — SDD §3.1/3.11 ---
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("receiptForm").addEventListener(
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
    true,
  );

  document.getElementById("receiptForm").addEventListener("input", (e) => {
    const el = e.target;
    if (el.value.trim()) {
      el.classList.remove("field-invalid");
      const errEl = document.getElementById(el.id + "Err");
      if (errEl) errEl.classList.remove("visible");
    }
    updateProgress();
  });
});

function addService(first = false) {
  const container = document.getElementById("servicesContainer");
  const div = document.createElement("div");
  div.className = "service-row";
  div.innerHTML = `
        <div class="field">
            ${first ? "<label>Serviço / Produto</label>" : ""}
            <input type="text" name="serviceName[]" placeholder="Descrição" required>
        </div>
        <div class="field">
            ${first ? "<label>Valor (R$)</label>" : ""}
            <input type="number" step="0.01" name="serviceValue[]" placeholder="0,00" required oninput="updateProgress()">
        </div>
        <button type="button" class="btn-remove" onclick="this.parentElement.remove(); updateProgress()">×</button>
    `;
  container.appendChild(div);
}

function updateProgress() {
  const form = document.getElementById("receiptForm");
  const required = form.querySelectorAll("input[required]");
  let filled = 0;
  required.forEach((i) => {
    if (i.value.trim()) filled++;
  });
  document.getElementById("stepFill").style.width =
    (filled / required.length) * 100 + "%";
}

function closePreview() {
  document.getElementById("printContainer").classList.remove("visible");
  document.body.style.overflow = "";
}

// --- IMPRESSÃO COM NOME DE ARQUIVO ---
function printReceipt() {
  const fd = new FormData(document.getElementById("receiptForm"));
  const data = Object.fromEntries(fd.entries());

  // Formata a data: "2027-01-01" → "01.01.2027"
  const rawDate = data.issueDate || "";
  const [y, m, d] = rawDate.split("-");
  const dateStr = d && m && y ? `${d}.${m}.${y}` : rawDate;

  const clientName = (data.clientName || "").trim();
  const carModel = (data.carModel || "").trim();

  // Monta: "01.01.2027 - Fulano de Tal - Corsa"
  const parts = [dateStr, clientName, carModel].filter(Boolean);
  const title = parts.join(" - ") || "Recibo";

  const original = document.title;
  document.title = title;
  window.print();
  // Restaura o título após o diálogo de impressão fechar
  setTimeout(() => {
    document.title = original;
  }, 1000);
}

// --- GERAÇÃO FINAL ---
document.getElementById("receiptForm").onsubmit = function (e) {
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
  }

  const fd0 = new FormData(this);
  const d0 = Object.fromEntries(fd0.entries());

  markField("receiptType", d0.receiptType && d0.receiptType !== "", null, "");
  markField("issueDate", !!d0.issueDate, null, "");
  markField(
    "clientName",
    d0.clientName?.trim().length >= 3,
    "clientNameErr",
    "Mínimo 3 caracteres",
  );
  markField(
    "clientPhone",
    /^\(\d{2}\) \d{4,5}-\d{4}$/.test(d0.clientPhone || ""),
    "clientPhoneErr",
    "Celular inválido",
  );
  markField(
    "providerName",
    d0.providerName?.trim().length >= 3,
    "providerNameErr",
    "Mínimo 3 caracteres",
  );
  markField(
    "carModel",
    d0.carModel?.trim().length >= 2,
    "carModelErr",
    "Mínimo 2 caracteres",
  );
  markField(
    "carYear",
    /^\d{4}$/.test(d0.carYear || "") &&
      +d0.carYear >= 1900 &&
      +d0.carYear <= new Date().getFullYear() + 1,
    "carYearErr",
    "Ano inválido",
  );
  markField(
    "estName",
    d0.estName?.trim().length > 0,
    "estNameErr",
    "Campo obrigatório",
  );
  markField("estStateSelect", !!d0.estState, null, "");
  markField("estCitySelect", !!d0.estCity, null, "");
  markField("estNeighborhood", d0.estNeighborhood?.trim().length > 0, null, "");
  markField("estStreet", d0.estStreet?.trim().length > 0, null, "");
  markField("estNumber", d0.estNumber?.trim().length > 0, null, "");
  markField("estCep", /^\d{5}-\d{3}$/.test(d0.estCep || ""), null, "");

  // Serviços: ao menos 1 item com descrição e valor — SDD §3.11
  const names0 = fd0.getAll("serviceName[]");
  const values0 = fd0.getAll("serviceValue[]");
  const hasService = names0.some(
    (n, i) => n.trim() && parseFloat(values0[i]) > 0,
  );
  if (!hasService && !firstInvalid) {
    const btn = document.querySelector(".btn-add");
    if (btn) firstInvalid = btn;
  }

  // CPF/CNPJ
  function validateDoc(input, errId) {
  const n = input.value.replace(/\D/g, "");
  const errEl = document.getElementById(errId);

  // Se o campo estiver vazio, ele é válido (opcional)
  if (!n) {
    input.classList.remove("field-invalid");
    if (errEl) errEl.classList.remove("visible");
    return true; 
  }

  // Se houver algo digitado, verifica se o tamanho e os dígitos estão corretos
  const ok = n.length === 11 ? validateCpf(n) : n.length === 14 ? validateCnpj(n) : false;

  input.classList.toggle("field-invalid", !ok);
  if (errEl) errEl.classList.toggle("visible", !ok);
  
  return ok;
}

  const fd = new FormData(this);
  const data = Object.fromEntries(fd.entries());
  const names = fd.getAll("serviceName[]");
  const values = fd.getAll("serviceValue[]");

  const resolvedLogo =
    logoMode === "upload" ? logoDataUrl : (data.logoUrl || "").trim();

  let servicesRows = "";
  let total = 0;
  names.forEach((name, i) => {
    const val = parseFloat(values[i]) || 0;
    total += val;
    servicesRows += `
            <tr>
                <td class="receipt-table-cell">${name}</td>
                <td class="receipt-table-cell receipt-table-cell--right">R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            </tr>`;
  });

  const issueDate = new Date(data.issueDate + "T12:00:00").toLocaleDateString(
    "pt-BR",
  );
  const now = new Date().toLocaleString("pt-BR");
  const stateSelect = document.getElementById("estStateSelect");
  const stateValue =
    stateSelect.options[stateSelect.selectedIndex]?.value || "";

  // Monta endereço do estabelecimento
  const estAddress = [
    data.estStreet,
    data.estNumber,
    data.estNeighborhood,
    data.estCity,
    stateValue,
  ]
    .filter(Boolean)
    .join(", ");

  const footerHtml =
    data.footerStyle === "minimal"
      ? `
        <div class="receipt-footer-signature-email">
          <div class="receipt-footer-sig-inner">
            ${resolvedLogo ? `<img src="${resolvedLogo}" alt="Logo" class="receipt-footer-sig-logo" onerror="this.style.display='none'">` : ""}
            ${resolvedLogo ? `<div class="receipt-footer-sig-divider"></div>` : ""}
            <div class="receipt-footer-sig-info">
              <p class="receipt-footer-sig-name">${data.estName}</p>
              ${data.providerDoc ? `<p class="receipt-footer-sig-detail"><span>CPF/CNPJ:</span> ${data.providerDoc}</p>` : ""}
              ${data.providerPhone ? `<p class="receipt-footer-sig-detail"><span>Telefone:</span> ${data.providerPhone}</p>` : ""}
              ${estAddress ? `<p class="receipt-footer-sig-detail"><span>Localizado:</span> ${estAddress}</p>` : ""}
            </div>
          </div>
          <p class="receipt-footer-timestamp">Documento emitido em ${now}</p>
        </div>`
      : `
            <div class="receipt-footer-signatures">
                <div class="receipt-signature-block">
                    <div class="receipt-signature-line">
                        <p class="receipt-signature-name">${data.providerName}</p>
                        <p class="receipt-signature-role">Assinatura do Beneficiário</p>
                    </div>
                </div>
                <div class="receipt-signature-block">
                    <div class="receipt-signature-line">
                        <p class="receipt-signature-name">${data.clientName}</p>
                        <p class="receipt-signature-role">Assinatura do Cliente</p>
                    </div>
                </div>
            </div>
            <p class="receipt-footer-timestamp">Gerado em ${now} — Recebi</p>`;

  const html = `
        <div class="receipt-wrapper">
            <div class="receipt-header">
                <div class="receipt-header-left">
                    ${resolvedLogo ? `<img src="${resolvedLogo}" alt="Logo da empresa" class="receipt-logo" onerror="this.style.display='none'">` : ""}
                    <div>
                        <p class="receipt-type">${data.receiptType}</p>
                        <h1 class="receipt-est-name">${data.estName}</h1>
                        <p class="receipt-est-address">${[data.estStreet, data.estNumber].filter(Boolean).join(", ")}${data.estNeighborhood ? " — " + data.estNeighborhood : ""}</p>
                    </div>
                </div>
                <div class="receipt-header-right">
                    <p class="receipt-date-label">Emissão</p>
                    <p class="receipt-date-value">${issueDate}</p>
                    <p class="receipt-city">${data.estCity || ""}${stateValue ? ", " + stateValue : ""}</p>
                </div>
            </div>
            <div class="receipt-body">
                <div class="receipt-parties">
                    <div class="receipt-party-card">
                        <p class="receipt-section-label">Cliente</p>
                        <p class="receipt-party-name">${data.clientName}</p>
                        <p class="receipt-party-detail">${data.clientDoc}</p>
                        ${data.clientPhone ? `<p class="receipt-party-detail">${data.clientPhone}</p>` : ""}
                    </div>
                    <div class="receipt-party-card">
                        <p class="receipt-section-label">Beneficiário</p>
                        <p class="receipt-party-name">${data.providerName}</p>
                        <p class="receipt-party-detail">${data.providerDoc}</p>
                        ${data.providerPhone ? `<p class="receipt-party-detail">${data.providerPhone}</p>` : ""}
                    </div>
                </div>
                ${
                  data.carModel
                    ? `
                <div class="receipt-vehicle-card">
                    <p class="receipt-vehicle-label">Veículo</p>
                    <div class="receipt-vehicle-info">
                        <span><strong>Modelo:</strong> ${data.carModel}</span>
                        ${data.carPlate ? `<span><strong>Placa:</strong> ${data.carPlate}</span>` : ""}
                        ${data.carYear ? `<span><strong>Ano:</strong> ${data.carYear}</span>` : ""}
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
                        <p class="receipt-total-value">R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>
                ${
                  data.observations
                    ? `
                <div class="receipt-observations">
                    <p class="receipt-observations-label">Observações</p>
                    <p class="receipt-observations-text">${data.observations}</p>
                </div>`
                    : ""
                }
                ${footerHtml}
            </div>
        </div>`;

  document.getElementById("receiptContent").innerHTML = html;
  document.getElementById("printContainer").classList.add("visible");
  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0);

  // Anuncia para leitores de tela — SDD §5.7
  const live = document.getElementById("a11yLive");
  if (live)
    live.textContent =
      "Recibo gerado com sucesso. Use os botões abaixo para imprimir ou fechar.";
};

/**
 * logo.js - Upload e Gestão de Logo
 * Recebi - Gerador de Recibo Online
 */

let logoDataUrl = "";
let logoMode = "upload";

/**
 * Alterna entre as abas de upload e URL
 * @param {string} mode - 'upload' ou 'url'
 */
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

/**
 * Remove elementos perigosos de SVG para prevenir XSS
 * @param {string} dataUrl - Data URL do SVG
 * @returns {string}
 */
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

/**
 * Aplica o arquivo de logo selecionado
 * @param {File} file - Arquivo de imagem
 */
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

/**
 * Handler para input de arquivo
 * @param {HTMLInputElement} input
 */
function handleLogoFile(input) {
  applyLogoFile(input.files[0]);
}

/**
 * Remove a logo atual
 * @param {Event} e
 */
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

/**
 * Inicializa a dropzone de logo com event listeners
 */
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

/**
 * Obtém a logo atual (Base64 ou URL)
 * @param {Object} formData - Dados do formulário
 * @returns {string}
 */
function getResolvedLogo(formData) {
  return logoMode === "upload" ? logoDataUrl : (formData.logoUrl || "").trim();
}

/**
 * Verifica se há logo definida
 * @returns {boolean}
 */
function hasLogo() {
  return logoMode === "upload" ? !!logoDataUrl : !!document.getElementById("logoUrlInput")?.value.trim();
}

// Exportar para uso em outros módulos
window.Logo = {
  switchLogoTab,
  applyLogoFile,
  handleLogoFile,
  clearLogo,
  initLogoDropZone,
  getResolvedLogo,
  hasLogo,
  getLogoDataUrl: () => logoDataUrl,
  setLogoDataUrl: (url) => (logoDataUrl = url),
};
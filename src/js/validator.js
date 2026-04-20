/**
 * validator.js - Validação de Campos
 * Recebi - Gerador de Recibo Online
 */

/**
 * Valida CPF
 * @param {string} n - Número do CPF (11 dígitos)
 * @returns {boolean}
 */
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

/**
 * Valida CNPJ
 * @param {string} n - Número do CNPJ (14 dígitos)
 * @returns {boolean}
 */
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

/**
 * Valida documento (CPF ou CNPJ)
 * @param {HTMLInputElement} input - Campo de input
 * @param {string} errId - ID do elemento de erro
 */
function validateDoc(input, errId) {
  const n = input.value.replace(/\D/g, "");
  if (!n) {
    // Campo vazio é aceitável — CPF/CNPJ é opcional
    input.classList.remove("field-invalid");
    document.getElementById(errId)?.classList.remove("visible");
    return true;
  }
  const ok =
    n.length === 11 ? validateCpf(n) : n.length === 14 ? validateCnpj(n) : false;
  input.classList.toggle("field-invalid", !ok);
  document.getElementById(errId)?.classList.toggle("visible", !ok);
  return ok;
}

/**
 * Valida formato de telefone
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
  return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(phone);
}

/**
 * Valida formato de CEP
 * @param {string} cep
 * @returns {boolean}
 */
function isValidCep(cep) {
  return /^\d{5}-\d{3}$/.test(cep);
}

/**
 * Valida ano (1900 até ano atual + 1)
 * @param {string} year
 * @returns {boolean}
 */
function isValidYear(year) {
  const y = parseInt(year);
  const currentYear = new Date().getFullYear();
  return /^\d{4}$/.test(year) && y >= 1900 && y <= currentYear + 1;
}

/**
 * Marca um campo como inválido
 * @param {string} id - ID do campo
 * @param {boolean} condition - Se válido
 * @param {string|null} errId - ID do elemento de erro
 * @param {string} msg - Mensagem de erro
 */
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
  } else {
    el.classList.remove("field-invalid");
    if (errEl) errEl.classList.remove("visible");
  }
  return condition;
}

// Exportar para uso em outros módulos
window.Validator = {
  validateCpf,
  validateCnpj,
  validateDoc,
  isValidPhone,
  isValidCep,
  isValidYear,
  markField,
};
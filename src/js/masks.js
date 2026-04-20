/**
 * masks.js - Máscaras de Input
 * Recebi - Gerador de Recibo Online
 */

// Máscara para CPF ou CNPJ (detecta automaticamente pelo comprimento)
function maskCpfCnpj(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 14);
  if (v.length <= 11) {
    // CPF: 000.000.000-00
    v = v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // CNPJ: 00.000.000/0000-00
    v = v
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
  input.value = v;
}

// Máscara para telefone celular: (00) 00000-0000
function maskPhone(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/(\d{2})(\d)/, "($1) $2");
  if (v.length > 13) v = v.replace(/(\d{5})(\d)/, "$1-$2");
  else v = v.replace(/(\d{4})(\d)/, "$1-$2");
  input.value = v;
}

// Formata CEP: 00000-000
function formatCep(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 8);
  if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5);
  input.value = v;
}

// Máscara para placa de veículo (Mercosul ou antiga)
function maskPlate(input) {
  let v = input.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7);
  if (v.length > 3) v = v.slice(0, 3) + "-" + v.slice(3);
  input.value = v;
}

// Máscara para ano (4 dígitos)
function maskYear(input) {
  input.value = input.value.replace(/\D/g, "").slice(0, 4);
}

// Máscara para valor monetário (opcional, se precisar de input text)
function maskMoney(input) {
  let v = input.value.replace(/\D/g, "");
  v = (parseInt(v) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  input.value = v;
}

// Exportar para uso em outros módulos
window.Masks = {
  maskCpfCnpj,
  maskPhone,
  formatCep,
  maskPlate,
  maskYear,
  maskMoney,
};
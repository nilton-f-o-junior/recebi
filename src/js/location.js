/**
 * location.js - Carregamento de Localidades (Cidades e CEP)
 * Recebi - Gerador de Recibo Online
 */

let isLoadingCities = false;

/**
 * Carrega cidades via IBGE API após selecionar estado
 * @param {string} stateCode - Código do estado (UF)
 */
async function loadCities(stateCode) {
  const citySelect = document.getElementById("estCitySelect");
  if (!stateCode) {
    citySelect.innerHTML = '<option value="">Selecione o estado primeiro</option>';
    citySelect.disabled = true;
    return;
  }

  citySelect.innerHTML = '<option value="">Carregando cidades...</option>';
  citySelect.disabled = true;
  isLoadingCities = true;

  try {
    const res = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}/municipios?orderBy=nome`
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
    console.error("Erro ao carregar cidades:", err);
  } finally {
    isLoadingCities = false;
  }
}

/**
 * Busca CEP e preenche endereço automaticamente
 * @param {string} cep - CEP com ou sem formatação
 */
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
    console.error("Erro ao buscar CEP:", err);
  }
}

/**
 * Obtém o texto da opção selecionada em um select
 * @param {string} selectId - ID do elemento select
 * @returns {string}
 */
function getSelectedText(selectId) {
  const select = document.getElementById(selectId);
  return select.options[select.selectedIndex]?.text || "";
}

// Exportar para uso em outros módulos
window.Location = {
  loadCities,
  fetchCep,
  getSelectedText,
  isLoadingCities: () => isLoadingCities,
};
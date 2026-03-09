// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('input[name="issueDate"]').value = new Date().toISOString().split('T')[0];
    addService(true);
    updateProgress();
});

let logoDataUrl = '';
let logoMode = 'upload';

// --- LOGO ---
function switchLogoTab(mode) {
    logoMode = mode;
    document.getElementById('tabUpload').classList.toggle('active', mode === 'upload');
    document.getElementById('tabUrl').classList.toggle('active', mode === 'url');
    document.getElementById('panelUpload').style.display = mode === 'upload' ? 'block' : 'none';
    document.getElementById('panelUrl').style.display   = mode === 'url'    ? 'block' : 'none';
}

function handleLogoFile(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2 MB.');
        input.value = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        logoDataUrl = e.target.result;
        document.getElementById('logoPreviewImg').src = logoDataUrl;
        document.getElementById('logoPlaceholder').style.display  = 'none';
        document.getElementById('logoPreviewArea').style.display  = 'block';
        document.getElementById('logoDropArea').classList.add('has-image');
    };
    reader.readAsDataURL(file);
}

function clearLogo(e) {
    e.stopPropagation();
    logoDataUrl = '';
    document.getElementById('logoFileInput').value = '';
    document.getElementById('logoPreviewImg').src = '';
    document.getElementById('logoPlaceholder').style.display  = 'block';
    document.getElementById('logoPreviewArea').style.display  = 'none';
    document.getElementById('logoDropArea').classList.remove('has-image');
}

// --- LOCALIDADES (IBGE) ---
async function loadCities(stateCode) {
    const citySelect = document.getElementById('estCitySelect');
    if (!stateCode) {
        citySelect.innerHTML = '<option value="">Selecione o estado primeiro</option>';
        citySelect.disabled = true;
        return;
    }
    citySelect.innerHTML = '<option value="">Carregando cidades...</option>';
    citySelect.disabled = true;

    try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}/municipios?orderBy=nome`);
        const cities = await res.json();
        citySelect.innerHTML = '<option value="">Selecione a cidade</option>';
        cities.forEach(city => {
            const opt = document.createElement('option');
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
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return;

    const spinner = document.getElementById('cepSpinner');
    const success = document.getElementById('cepSuccess');
    spinner.style.display = 'inline';

    try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();
        if (data.erro) { spinner.style.display = 'none'; return; }

        const streetEl = document.getElementById('estStreet');
        const neighEl  = document.getElementById('estNeighborhood');
        if (data.logradouro) streetEl.value = data.logradouro;
        if (data.bairro) neighEl.value = data.bairro;

        const stateSelect = document.getElementById('estStateSelect');
        if (data.uf) {
            stateSelect.value = data.uf;
            await loadCities(data.uf);
            const citySelect = document.getElementById('estCitySelect');
            if (data.localidade) citySelect.value = data.localidade;
        }

        spinner.style.display = 'none';
        success.style.display = 'inline';
        setTimeout(() => { success.style.display = 'none'; }, 3000);
    } catch (err) { spinner.style.display = 'none'; }
}

// --- MÁSCARAS ---
function maskCpfCnpj(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 14);
    if (v.length <= 11) {
        v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        v = v.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    input.value = v;
}

function maskPhone(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{2})(\d)/, '($1) $2');
    if (v.length > 13) v = v.replace(/(\d{5})(\d)/, '$1-$2');
    else v = v.replace(/(\d{4})(\d)/, '$1-$2');
    input.value = v;
}

function formatCep(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
    input.value = v;
}

function maskPlate(input) {
    let v = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
    if (v.length > 3) v = v.slice(0, 3) + '-' + v.slice(3);
    input.value = v;
}

// --- VALIDAÇÃO ---
function validateDoc(input, errId) {
    const n = input.value.replace(/\D/g, '');
    const ok = n.length === 11 ? validateCpf(n) : n.length === 14 ? validateCnpj(n) : false;
    input.classList.toggle('field-invalid', !ok);
    document.getElementById(errId).classList.toggle('visible', !ok);
}

function validateCpf(n) {
    if (n.length !== 11 || /^(\d)\1+$/.test(n)) return false;
    let s = 0;
    for (let i = 0; i < 9; i++) s += +n[i] * (10 - i);
    let r = (s * 10) % 11; if (r >= 10) r = 0;
    if (r !== +n[9]) return false;
    s = 0;
    for (let i = 0; i < 10; i++) s += +n[i] * (11 - i);
    r = (s * 10) % 11; if (r >= 10) r = 0;
    return r === +n[10];
}

function validateCnpj(n) {
    if (n.length !== 14 || /^(\d)\1+$/.test(n)) return false;
    const calc = (ns, len) => {
        let s = 0, p = len - 7;
        for (let i = len; i >= 1; i--) { s += +ns[len - i] * p--; if (p < 2) p = 9; }
        const r = s % 11; return r < 2 ? 0 : 11 - r;
    };
    return calc(n, 12) === +n[12] && calc(n, 13) === +n[13];
}

// --- UI/UX ---
function addService(first = false) {
    const container = document.getElementById('servicesContainer');
    const div = document.createElement('div');
    div.className = 'service-row';
    div.innerHTML = `
        <div class="field">
            ${first ? '<label>Serviço / Produto *</label>' : ''}
            <input type="text" name="serviceName[]" placeholder="Descrição" required>
        </div>
        <div class="field">
            ${first ? '<label>Valor (R$) *</label>' : ''}
            <input type="number" step="0.01" name="serviceValue[]" placeholder="0,00" required oninput="updateProgress()">
        </div>
        <button type="button" class="btn-remove" onclick="this.parentElement.remove(); updateProgress()">×</button>
    `;
    container.appendChild(div);
}

function selectSwatch(el) {
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('accentColorHex').value = el.dataset.color;
}

function updateProgress() {
    const form = document.getElementById('receiptForm');
    const required = form.querySelectorAll('input[required]');
    let filled = 0;
    required.forEach(i => { if(i.value.trim()) filled++; });
    document.getElementById('stepFill').style.width = (filled / required.length * 100) + '%';
}

function closePreview() {
    document.getElementById('printContainer').classList.remove('visible');
    document.body.style.overflow = '';
}

// --- GERAÇÃO FINAL ---
document.getElementById('receiptForm').onsubmit = function(e) {
    e.preventDefault();

    const fd = new FormData(this);
    const data = Object.fromEntries(fd.entries());
    const names = fd.getAll('serviceName[]');
    const values = fd.getAll('serviceValue[]');
    const accent = data.accentColorHex;

    let total = 0;
    let servicesRows = names.map((name, i) => {
        const val = parseFloat(values[i]) || 0;
        total += val;
        return `<tr><td style="padding:10px 0;font-size:14px;border-bottom:1px solid #F3F4F6">${name}</td><td style="padding:10px 0;font-size:14px;text-align:right;border-bottom:1px solid #F
3F4F6">R$ ${val.toLocaleString('pt-BR', {minimumFractionDigits:2})}</td></tr>`;
    }).join('');

    const resolvedLogo = logoMode === 'upload' ? logoDataUrl : data.logoUrl;
    const issueDate = new Date(data.issueDate + 'T12:00:00').toLocaleDateString('pt-BR');

    const html = `
    <div style="font-family:'DM Sans',sans-serif;background:white;">
        <div style="background:${accent};padding:28px 36px;display:flex;justify-content:space-between;color:white">
            <div style="display:flex;gap:16px;align-items:center">
                ${resolvedLogo ? `<img src="${resolvedLogo}" style="max-height:50px;background:white;padding:4px;border-radius:4px">` : ''}
                <div><h1 style="font-size:22px;margin:0">${data.estName}</h1><p style="font-size:12px;opacity:0.8">${data.estStreet || ''}</p></div>
            </div>
            <div style="text-align:right">
                <p style="font-size:11px;opacity:0.7">${data.receiptType}</p>
                <p style="font-size:18px;font-weight:600">${issueDate}</p>
            </div>
        </div>
        <div style="padding:32px 36px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px">
                <div style="background:#F9FAFB;padding:16px;border-radius:10px">
                    <p style="font-size:10px;color:#6B7280;text-transform:uppercase">Cliente</p>
                    <p style="font-weight:600">${data.clientName}</p><p style="font-size:13px">${data.clientDoc}</p>
                </div>
                <div style="background:#F9FAFB;padding:16px;border-radius:10px">
                    <p style="font-size:10px;color:#6B7280;text-transform:uppercase">Beneficiário</p>
                    <p style="font-weight:600">${data.providerName}</p><p style="font-size:13px">${data.providerDoc}</p>
                </div>
            </div>
            <table style="width:100%;border-collapse:collapse">${servicesRows}</table>
            <div style="display:flex;justify-content:flex-end;margin-top:20px">
                <div style="background:${accent};color:white;padding:15px 25px;border-radius:10px;text-align:right">
                    <span style="font-size:10px;text-transform:uppercase">Total</span>
                    <div style="font-size:26px;font-weight:700">R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
                </div>
            </div>
        </div>
    </div>`;

    document.getElementById('receiptContent').innerHTML = html;
    document.getElementById('printContainer').classList.add('visible');
    document.body.style.overflow = 'hidden';
};

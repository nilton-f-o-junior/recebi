// ### 4.6 Módulo: Dados do Veículo

// #### TC-VEI-001: Preenchimento de Campos Obrigatórios

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Preencher Modelo | Fiat Strada | Modelo aceito |
// | 2 | Preencher Placa (Mercosul) | ABC-1D23 | Máscara aplicada |
// | 3 | Preencher Ano | 2024 | Ano aceito |
// | 4 | Gerar recibo | — | Seção veículo impressa |

// **Critério de Aceite:** Campos aceitos, seção impressa no recibo.

describe('TC-VEI-001', () => {

  it.skip('Preenchimento de Campos Obrigatórios', () => {
  })

})

// #### TC-VEI-002: Validação de Placa Mercosul

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir placa Mercosul | ABC-1D23 | Placa aceita |
// | 2 | Inserir placa antiga | ABC-1234 | Placa aceita |
// | 3 | Inserir placa incompleta | ABC-12 | Erro: "Placa incompleta" |
// | 4 | Inserir placa com caracteres inválidos | ABD-1X23 | Erro: "Placa inválida" |

// **Critério de Aceite:** Ambos formatos (Mercosul e antigo) aceitos.

describe('TC-VEI-002', () => {

  it.skip('Validação de Placa Mercosul', () => {
  })

})

// #### TC-VEI-003: Validação de Ano do Veículo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir ano válido | 2024 | Ano aceito |
// | 2 | Inserir ano futuro (+1) | 2027 | Ano aceito |
// | 3 | Inserir ano muito antigo | 1800 | Erro: "Ano deve ser entre 1900 e ano atual + 1" |
// | 4 | Inserir ano futuro distante | 2050 | Erro: "Ano deve ser entre 1900 e ano atual + 1" |
// | 5 | Inserir 3 dígitos | 999 | Erro: "Ano deve ter 4 dígitos" |

// **Critério de Aceite:** Anos válidos (1900 a ano+1) aceitos.

describe('TC-VEI-003', () => {

  it.skip('Validação de Ano do Veículo', () => {
  })

})

// #### TC-VEI-004: Visibilidade Condicional da Seção

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Deixar todos os campos vazios | — | Seção veículo não aparece no recibo |
// | 2 | Preencher apenas Modelo | Fiat Strada | Seção veículo aparece no recibo |
// | 3 | Preencher Modelo e Ano | Fiat Strada, 2024 | Seção veículo aparece no recibo |

// **Critério de Aceite:** Seção impressa se ao menos um campo preenchido.

describe('TC-VEI-004', () => {

  it.skip('Visibilidade Condicional da Seção', () => {
  })

})

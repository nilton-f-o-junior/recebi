// ### 4.12 Módulo: Máscaras de Input

// #### TC-MSK-001: Máscara de CPF

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar 9 primeiros dígitos | 529982247 | Exibido: 529.982.247-__ |
// | 2 | Digitar dígito verificador | 62 | Exibido: 529.982.247-62 |

// **Critério de Aceite:** Máscara 000.000.000-00 aplicada automaticamente.

describe('TC-MSK-001', () => {

  it.skip('Máscara de CPF', () => {
  })

})

// #### TC-MSK-002: Máscara de CNPJ

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar 12 primeiros dígitos | 114447770001 | Exibido: 11.444.777/0001-__ |
// | 2 | Digitar dígitos verificadores | 61 | Exibido: 11.444.777/0001-61 |

// **Critério de Aceite:** Máscara 00.000.000/0000-00 aplicada automaticamente.

describe('TC-MSK-002', () => {

  it.skip('Máscara de CNPJ', () => {
  })

})

// #### TC-MSK-003: Máscara de Celular

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar DDD + 8 dígitos | 1199998888 | Exibido: (11) 99999-8888 |
// | 2 | Digitar número com 9 dígitos direto | 999998888 | Exibido: (99) 99998-8888 |

// **Critério de Aceite:** Máscara (00) 00000-0000 aplicada automaticamente.

describe('TC-MSK-003', () => {

  it.skip('Máscara de Celular', () => {
  })

})

// #### TC-MSK-004: Máscara de CEP

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar 5 primeiros dígitos | 01310 | Exibido: 01310-___ |
// | 2 | Digitar dígitos finais | 100 | Exibido: 01310-100 |

// **Critério de Aceite:** Máscara 00000-000 aplicada automaticamente.

describe('TC-MSK-004', () => {

  it.skip('Máscara de CEP', () => {
  })

})

// #### TC-MSK-005: Máscara de Placa

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar placa Mercosul | ABC1D23 | Exibido: ABC-1D23 |
// | 2 | Digitar placa antiga | ABC1234 | Exibido: ABC-1234 |

// **Critério de Aceite:** Ambos formatos suportados com máscara AAA-0000 ou AAA-0A00.

describe('TC-MSK-005', () => {

  it.skip('Máscara de Placa', () => {
  })

})

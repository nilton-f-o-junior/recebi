// ### 4.4 Módulo: Dados do Cliente

// #### TC-CLI-001: Preenchimento de Dados Obrigatórios

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Preencher Nome Completo | João Carlos da Silva | Nome aceito, sem erro |
// | 2 | Preencher Celular | 11999998888 | Máscara aplicada: (11) 99999-8888 |
// | 3 | Deixar CPF/CNPJ vazio | — | Campo opcional, sem erro |
// | 4 | Submeter formulário | — | Campos válidos |

// **Critério de Aceite:** Nome aceito com 3+ caracteres, celular formatado corretamente.

describe('TC-CLI-001', () => {

  it.skip('Preenchimento de Dados Obrigatórios', () => {
  })

})

// #### TC-CLI-002: Validação de Nome Mínimo

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir 1 caractere | A | Erro: "Nome deve ter no mínimo 3 caracteres" |
// | 2 | Inserir 2 caracteres | AB | Erro: "Nome deve ter no mínimo 3 caracteres" |
// | 3 | Inserir 3 caracteres | ABC | Nome aceito, erro removido |

// **Critério de Aceite:** Nomes com <3 caracteres rejeitados com mensagem clara.

describe('TC-CLI-002', () => {

  it.skip('Validação de Nome Mínimo', () => {
  })

})

// #### TC-CLI-003: Validação de CPF Válido

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir CPF válido | 529.982.247-62 | CPF aceito, máscara aplicada |
// | 2 | Inserir outro CPF válido | 111.444.777-35 | CPF aceito, máscara aplicada |
// | 3 | Verificar formatação no recibo | — | CPF impresso com máscara |

// **Critério de Aceite:** CPFs válidos aceitos e formatados corretamente.

describe('TC-CLI-003', () => {

  it.skip('Validação de CPF Válido', () => {
  })

})

// #### TC-CLI-004: Validação de CPF Inválido

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir CPF com dígito errado | 529.982.247-63 | Erro: "CPF inválido" |
// | 2 | Inserir CPF com zeros | 000.000.000-00 | Erro: "CPF inválido" |
// | 3 | Inserir CPF com números sequenciais | 123.456.789-09 | Erro: "CPF inválido" |
// | 4 | Corrigir para CPF válido | 529.982.247-62 | Erro removido, CPF aceito |

// **Critério de Aceite:** CPFs inválidos rejeitados, dígitos verificadores validados.

describe('TC-CLI-004', () => {

  it.skip('Validação de CPF Inválido', () => {
  })

})

// #### TC-CLI-005: Validação de Celular

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Inserir número com 8 dígitos | 99998888 | Erro: "Celular inválido" |
// | 2 | Inserir número com formato correto | 11999998888 | Máscara: (11) 99999-8888 |
// | 3 | Inserir DDD inválido (00) | 00999998888 | Erro: "DDD inválido" |
// | 4 | Inserir DDD inválido (99) | 99999998888 | Erro: "DDD inválido" |

// **Critério de Aceite:** Celular deve ter DDD válido + 9 dígitos.

describe('TC-CLI-005', () => {

  it.skip('Validação de Celular', () => {
  })

})

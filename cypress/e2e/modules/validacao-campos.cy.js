// ### 4.11 Módulo: Validação de Campos

// #### TC-VAL-001: Validação em Tempo Real (on-blur)

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Digitar nome inválido e sair do campo | A | Erro inline aparece |
// | 2 | Corrigir para nome válido | João | Erro removido |
// | 3 | Tocar em outro campo sem digitar | — | Erro persiste se campo continua inválido |

// **Critério de Aceite:** Erros aparecem/removem em tempo real.

describe('TC-VAL-001', () => {

  it.skip('Validação em Tempo Real (on-blur)', () => {
  })

})

// #### TC-VAL-002: Scroll até Primeiro Erro

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Preencher formulário com erros | Nome: "", Cel: "" | Erros visíveis |
// | 2 | Submeter formulário | — | Scroll até primeiro campo inválido |
// | 3 | Verificar foco | — | Primeiro campo inválido em foco |

// **Critério de Aceite:** Scroll suave até primeiro campo inválido.

describe('TC-VAL-002', () => {

  it.skip('Scroll até Primeiro Erro', () => {
  })

})

// #### TC-VAL-003: Classe CSS de Erro

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Deixar campo obrigatório vazio | — | Classe .field-error aplicada |
// | 2 | Verificar estilo visual | — | Borda vermelha no campo |
// | 3 | Corrigir campo | — | Classe .field-error removida |

// **Critério de Aceite:** Estilos aplicados/removidos corretamente.

describe('TC-VAL-003', () => {

  it.skip('Classe CSS de Erro', () => {
  })

})

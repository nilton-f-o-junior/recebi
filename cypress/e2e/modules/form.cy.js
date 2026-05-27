// ### 4.1 Módulo: Formulário Principal

// #### TC-FRM-001: Carregamento Inicial do Formulário

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Abrir a aplicação no navegador | URL: localhost:3000 | Página carrega completamente |
// | 2 | Verificar campos visíveis | — | Todos os campos do formulário estão visíveis |
// | 3 | Verificar estado inicial do botão | — | Botão "Gerar Recibo" está desabilitado |
// | 4 | Verificar estado do checkbox | — | Checkbox de privacidade está desmarcado |
// | 5 | Verificar quantidade de linhas de serviço | — | 1 linha de serviço pré-adicionada |
// | 6 | Verificar data de emissão | — | Campo pré-preenchido com data atual |

// **Critério de Aceite:** Página carrega em <3 segundos, todos os elementos visíveis, estado inicial correto.

describe('TC-FRM-001', () => {

  it('Carregamento Inicial do Formulário', () => {
    
    // | 1 | Abrir a aplicação no navegador | URL: localhost:3000 | Página carrega completamente |
    cy.visit('https://recebi-ten.vercel.app/')
    cy.get('[data-testid="btn-start-form"]').click()
    cy.document().its('readyState').should('eq', 'complete')

    // | 2 | Verificar campos visíveis | — | Todos os campos do formulário estão visíveis |
    cy.get('[data-testid="input-receipt-type"]').should('be.visible')
    cy.get('[data-testid="input-date"]').should('be.visible')
    cy.get('[data-testid="input-client-name"]').should('be.visible')
    cy.get('[data-testid="input-client-document"]').should('be.visible')
    cy.get('[data-testid="input-client-phone"]').should('be.visible')
    cy.get('[data-testid="input-beneficiary-name"]').should('be.visible')
    cy.get('[data-testid="input-beneficiary-document"]').should('be.visible')
    cy.get('[data-testid="input-beneficiary-phone"]').should('be.visible')
    cy.get('[data-testid="input-vehicle-model"]').should('be.visible')
    cy.get('[data-testid="input-vehicle-plate"]').should('be.visible')
    cy.get('[data-testid="input-vehicle-year"]').should('be.visible')
    cy.get('[data-testid="input-establishment-name"]').should('be.visible')
//    cy.get('[data-testid="select-establishment-state"]').should('be.visible')
//    cy.get('[data-testid="select-establishment-city"]').should('be.visible')
//    cy.get('[input-establishment-neighborhood]').should('be.visible')
//    cy.get('[input-establishment-zipcode]').should('be.visible')
//    cy.get('[input-establishment-street]').should('be.visible')
//    cy.get('[input-establishment-number]').should('be.visible')
//     cy.get('[input-service-name]').should('be.visible')
//     cy.get('[input-service-value]').should('be.visible')
//     cy.get('[input-observations]').should('be.visible')
  })
  
})



// #### TC-FRM-002: Habilitação do Botão ao Marcar Privacidade

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Localizar checkbox de privacidade | — | Checkbox visível e desmarcado |
// | 2 | Clicar no checkbox | — | Checkbox fica marcado |
// | 3 | Verificar estado do botão | — | Botão continua desabilitado (campos obrigatórios não preenchidos) |
// | 4 | Preencher todos os campos obrigatórios | Dados válidos completos | — |
// | 5 | Verificar estado do botão | — | Botão habilitado e clicável |

// **Critério de Aceite:** Botão permanece desabilitado até que checkbox E campos obrigatórios estejam válidos.

// #### TC-FRM-003: Submissão de Formulário Válido

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Preencher dados mínimos obrigatórios | Cliente: João Silva, Cel: (11) 99999-9999, Benef.: Maria Ltda, Estabelecimento: completo, 1 serviço | Formulário completo |
// | 2 | Marcar checkbox de privacidade | — | Checkbox marcado |
// | 3 | Clicar em "Gerar Recibo Agora" | — | Botão mostra loading (spinner) |
// | 4 | Aguardar processamento | — | Recibo gerado e renderizado |
// | 5 | Verificar abertura do diálogo de impressão | — | window.print() acionado |

// **Critério de Aceite:** Recibo gerado corretamente, diálogo de impressão aberto.

// #### TC-FRM-004: Redirecionamento para GitHub do Projeto

// | Step | Descrição | Dados de Teste | Resultado Esperado |
// |------|-----------|----------------|-------------------|
// | 1 | Localizar ícone do GitHub no rodapé ou cabeçalho | — | Ícone visível e clicável |
// | 2 | Clicar no ícone do GitHub | — | Nova aba aberta com a URL do repositório do projeto |
// | 3 | Verificar URL de destino | URL do Git | URL correta e página carregada |

// **Critério de Aceite:** O link direciona corretamente para o repositório oficial do projeto em uma nova aba.


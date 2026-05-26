describe('4.1 Módulo: Formulário Principal', () => {

  it('TC-FRM-001: Carregamento Inicial do Formulário', () => {

    // arrange
    cy.visit('https://recebi-ten.vercel.app/')

    // act
    cy.get('[data-testid="btn-start-form"]').click()
    
    // assert
    cy.url().should('eq', 'https://recebi-ten.vercel.app/src/html/form.html')
    
  })
  
})

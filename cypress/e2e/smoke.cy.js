describe("smoke", () => {
  it("carrega a página inicial do app", () => {
    cy.visit("/");

    cy.document().its("readyState").should("eq", "complete");
    cy.title().should("include", "Recebi");
    cy.get('[data-testid="btn-start-form"]').should("be.visible");
  });
});

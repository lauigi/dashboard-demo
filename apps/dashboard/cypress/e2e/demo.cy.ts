describe('template spec', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/_serverFn/**').as('loginRequest');
  });
  it('passes', () => {
    cy.visit('/article/create', { failOnStatusCode: false });
    cy.wait(1000);
    cy.get('[name="email"]').type('aaa@example.com');
    cy.get('[name="password"]').type('password123{enter}', { delay: 0 });
    cy.get('h2').should('contain', 'Create Article');
    cy.wait(1000);
    cy.get('#article-editor-title').type('abcd 1234567890');
    cy.get('#article-editor-content').type(
      `Victoria tametsi campana concido adeptio tripudio ulciscor recusandae conservo. Tardus sursum verecundia. Tribuo tamen quos curso veniam soleo cubicularis agnosco.

Illum cetera brevis et assentator. Denuo natus arceo communis cunae titulus tepesco cado praesentium. Voveo viridis magnam subnecto.

Supplanto subseco vitae patior repellat ulciscor spargo tabella canis. Arceo dicta defleo vulpes perferendis. Concido tripudio possimus subiungo claustrum inflammatio reiciendis odit veritas.`,
      { delay: 0 },
    );
    cy.get('#publish-button').click();
    cy.wait(1000);
    cy.get('h2').should('contain', 'abcd 1234567890');
  });
});

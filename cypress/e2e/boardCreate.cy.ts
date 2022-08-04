describe('Create Board', function () {
  const USER_NAME = 'Anon';
  const ORG_NAME = 'Org';

  beforeEach(() => {
    window.indexedDB.deleteDatabase('roadmapDB')
    cy.register(USER_NAME, ORG_NAME);
  });

  it('creates board', function () {
    const NEW_BOARD_NAME = 'New Board'
    cy.visit(`/${ORG_NAME}/boards`)
    cy.get('[data-cy="add"]')
      .click()
    cy.get('input')
      .type(`${NEW_BOARD_NAME}{enter}`)
    cy.get('[data-cy="boards"]')
      .contains(NEW_BOARD_NAME)
      .click()
    cy.url().should('include', `/${ORG_NAME}/roadmap/2`)

    cy.get('main')
      .contains(NEW_BOARD_NAME)
  });
});

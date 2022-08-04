describe('Settings', function () {
  const USER_NAME = 'Anon';
  const ORG_NAME = 'Org';

  beforeEach(() => {
    window.indexedDB.deleteDatabase('roadmapDB')
    cy.register(USER_NAME, ORG_NAME);
  });

  it('renames organisation name and change url org slug', () => {
    const NEW_ORG_NAME = 'Orgxx';

    cy.visit(`${ORG_NAME}/settings`)

    cy.get('input[name="org"]')
      .clear()
      .clear()
      .type(NEW_ORG_NAME)
    cy.get('[type="checkbox"]')
      .check({force: true})
    cy.get('button[type="submit"]')
      .click()

    cy.visit(`${NEW_ORG_NAME}/settings`)
  })
});

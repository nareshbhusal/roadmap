describe('Authentication', function () {
  beforeEach(() => {
    window.indexedDB.deleteDatabase('roadmapDB')
  })

  it('creates account and redirects to demo roadmap with org name in url', function () {
    const ORG_NAME = 'Evil Org';
    const name  = 'Naresh';
    const USER_NAME = 'Anon';

    //@ts-ignore
    cy.register(USER_NAME, ORG_NAME);

    cy.url().should('include', '/evil-org/roadmap/1')

    cy.visit('/evil-org/settings')
    cy.get('input[name=org]')
      .should('have.value', ORG_NAME)
    cy.get('input[name=name]')
      .should('have.value', USER_NAME)
  })
})

export {}

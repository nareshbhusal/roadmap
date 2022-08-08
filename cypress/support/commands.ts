/// <reference types="cypress" />

//@ts-ignore
Cypress.Commands.add('register', (USER_NAME: string, ORG_NAME: string) => {
  cy.visit('/register');
  cy.get('input[name=org]')
  .type(ORG_NAME)
  cy.get('input[name=name]')
  .type(`${USER_NAME}{enter}`)
});

//@ts-ignore
Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args)
})

//@ts-ignore
Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args)
})

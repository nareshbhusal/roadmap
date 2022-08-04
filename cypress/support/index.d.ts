/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      register(USER_NAME: string, ORG_NAME: string): Chainable<void>
    }
  }
}

declare namespace Cypress {
    interface Chainable<Subject = any> {
        /**
         * Custom command to ... add your description here
         * @example cy.clickOnMyJourneyInCandidateCabinet()
         */
        clickOnMyJourneyInCandidateCabinet(): Chainable<null>;
    }
}

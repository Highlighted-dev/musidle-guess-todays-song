// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  cy.visit('http://localhost:4200/');

  cy.get('nav').then(nav => {
    if (nav.find('button:contains("Logout")').length > 0) {
      nav.find('button:contains("Logout")').trigger('click');
    }
  });

  cy.get('button').contains('Login').click();
  cy.get('input[id=email]').type(email);
  cy.get('input[id=password]').type(password);
  cy.get('button').contains('Sign in').click();

  // Add a wait for cookies to be set (adjust as needed)
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(200);

  // Validate the existence of the 'token' cookie
  cy.getCookie('token').should('exist');
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

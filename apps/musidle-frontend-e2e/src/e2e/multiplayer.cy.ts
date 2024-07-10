describe('Testing Musidle multiplayer', () => {
  beforeEach(() => {
    cy.session('login', () => cy.login('Cypresstest001@musidle.com', 'Cypresstest001@musidle.com'));
  });
  it('should display lobby, create a room with a "Create room" button, change settings and leave the room', () => {
    cy.visit('http://localhost:4200/games/multiplayer');
    cy.contains('Create room').click();
    cy.get('input[id=mxRoundsPhaseOne]', { timeout: 15000 }).type('2');
    cy.get('input[id=mxRoundsPhaseTwo]').type('3');
    cy.get('input[id=mxTimer]').type('45');
    cy.get('button').contains('Save').click();

    //check if all the settings are correct
    cy.get('input[id=mxRoundsPhaseOne]').should('have.attr', 'placeholder', '2');
    cy.get('input[id=mxRoundsPhaseTwo]').should('have.attr', 'placeholder', '3');

    cy.contains('Leave game').click();
  });
});

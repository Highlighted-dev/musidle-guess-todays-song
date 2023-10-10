describe('Testing Musidle multiplayer', () => {
  beforeEach(() => {
    cy.session('login', () => cy.login('Cypresstest001@musidle.com', 'Cypresstest001@musidle.com'));
  });

  it('should display lobby, create a room with a "Create room" button, change settings and leave the room', () => {
    cy.visit('http://localhost:4200/multiplayer');
    cy.contains('Create room').click();

    cy.get('input[id=mxRoundsPhaseOne]').type('2');
    cy.get('input[id=mxRoundsPhaseTwo]').type('3');
    cy.get('button').contains('Save').click();

    //check if all the settings are correct
    cy.get('input[id=mxRoundsPhaseOne]').should('have.attr', 'placeholder', '2');
    cy.get('input[id=mxRoundsPhaseTwo]').should('have.attr', 'placeholder', '3');

    cy.contains('Leave game').click();
  });

  it('Go to the room with ID: test012, change settings and start the game', () => {
    cy.visit('http://localhost:4200/multiplayer/test12');

    cy.get('input[id=mxRoundsPhaseOne]').type('1');
    cy.get('input[id=mxRoundsPhaseTwo]').type('1');
    cy.get('button').contains('Save').click();

    //check if all the settings are correct
    cy.get('input[id=mxRoundsPhaseOne]').should('have.attr', 'placeholder', '1');
    cy.get('input[id=mxRoundsPhaseTwo]').should('have.attr', 'placeholder', '1');

    cy.get('button').contains('Start game').click();
  });
  it('should check if there are 8 buttons in game phase 1 and click the first one', () => {
    cy.visit('http://localhost:4200/multiplayer/test12');
    cy.get('div.rounded-lg.border.bg-card.text-card-foreground')
      .find('button')
      .should('have.length', 8);
    cy.get('div.rounded-lg.border.bg-card.text-card-foreground').find('button').first().click();
    cy.wait(100);
  });
  it('should click "play/pause" button, change the stage to 2, find the song named "Maroon 5 - Payphone" and submit it', () => {
    cy.visit('http://localhost:4200/multiplayer/test12');
    cy.get('button').contains('Play / Pause').click();

    cy.get('button').contains('Change stage').click();
    cy.get('label').contains('Stage 2').should('exist');

    cy.get('button').contains('Select song...').click();
    cy.get('input[placeholder="Search song..."]').type('Maroon 5 - Payphone');
    cy.get('button').contains('Submit').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(4050);
  });
  it('should check if user is in game phase 2, check if there are 16 buttons and click the first one', () => {
    cy.visit('http://localhost:4200/multiplayer/test12');
    cy.get('h3').contains('Choose an artist').should('exist');
    cy.get('div.rounded-lg.border.bg-card.text-card-foreground')
      .find('button')
      .should('have.length', 16);
    cy.get('div.rounded-lg.border.bg-card.text-card-foreground').find('button').first().click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3050);
  });
  it('should click "play/pause" button, change the stage to 3, find the song named "Maroon 5 - Payphone" and submit it', () => {
    cy.visit('http://localhost:4200/multiplayer/test12');
    cy.get('button').contains('Play / Pause').click();

    cy.get('button').contains('Change stage').click();
    cy.get('label').contains('Stage 2').should('exist');
    cy.get('button').contains('Change stage').click();
    cy.get('label').contains('Stage 3').should('exist');
    cy.get('button').contains('Select song...').click();
    cy.get('input[placeholder="Search song..."]').type('Maroon 5 - Payphone');
    cy.get('button').contains('Submit').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(4050);
  });
  it('should check if user is in game phase 3, check if there are 6 toggles and click the second one', () => {
    cy.visit('http://localhost:4200/multiplayer/test12');
    cy.get('h3').contains('FINAL ROUND').should('exist');
    cy.get('div.grid.grid-cols-3.gap-2').find('button').should('have.length', 6);

    cy.get('div.grid.grid-cols-3.gap-2').find('button').eq(2).click();
    cy.get('button').contains('Play / Pause').click();
  });
});

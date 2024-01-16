import request from 'supertest';
import { app } from '../index';
import { IRoom } from '../@types/room';

const checkRoomStructure = (room: IRoom) => {
  expect(room).toHaveProperty('_id');
  expect(room).toHaveProperty('roomCode');
  expect(room).toHaveProperty('players');
  expect(room).toHaveProperty('spectators');
  expect(room).toHaveProperty('songId');
  expect(room).toHaveProperty('stage');
  expect(room).toHaveProperty('maxRoundsPhaseOne');
  expect(room).toHaveProperty('maxRoundsPhaseTwo');
  expect(room).toHaveProperty('round');
  expect(room).toHaveProperty('isInGameLobby');
  expect(room).toHaveProperty('isInSelectMode');
  expect(room).toHaveProperty('timer');
  expect(room).toHaveProperty('maxTimer');
  expect(room).toHaveProperty('votesForTurnSkip');
  expect(room).toHaveProperty('songs');
};

describe('POST /rooms', () => {
  it('responds with a newly created room', async () => {
    const response = await request(app)
      .post('/externalApi/rooms')
      .send({
        roomCode: 'TestRoomCode',
        player: {
          _id: '60e1b9b2a1c3c5c9f4d2e4b2',
          username: 'TestUser',
        },
        maxRoundsPhaseOne: 40,
        maxRoundsPhaseTwo: 8,
      })
      .expect('Content-Type', /json/)
      .expect(200);

    checkRoomStructure(response.body);
  });
});

describe('GET /rooms/:roomCode', () => {
  it('gets a roomCode and returns a room with that id', async () => {
    const response = await request(app)
      .get('/externalApi/rooms/TestRoomCode')
      .expect('Content-Type', /json/)
      .expect(200);

    checkRoomStructure(response.body);
  });
});

describe('GET /rooms/', () => {
  it('gets all rooms', async () => {
    const response = await request(app)
      .get('/externalApi/rooms')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.rooms).toBeInstanceOf(Array);

    response.body.rooms.forEach((room: IRoom) => {
      checkRoomStructure(room);
    });
  });
});

describe('POST /rooms/start', () => {
  it('Starts the game', async () => {
    await request(app)
      .post('/externalApi/rooms/start')
      .send({
        roomCode: 'TestRoomCode',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    //Check if isInGameLobby is false
    const response = await request(app)
      .get('/externalApi/rooms/TestRoomCode')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.isInGameLobby).toBe(false);
  });
});

describe('POST /songs/chooseSong', () => {
  it('gets a songId, sets it in database, and returns a song with that id', async () => {
    const response = await request(app)
      .post('/externalApi/songs/chooseSong')
      .send({
        roomCode: 'TestRoomCode',
        songId: 'pop',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.songId).toContain('pop');
  });
});

describe('POST /rooms/turnChange', () => {
  it('Changes the turn', async () => {
    await request(app)
      .post('/externalApi/rooms/turnChange')
      .send({
        roomCode: 'TestRoomCode',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    //Check if the turn has changed
    const response = await request(app)
      .get('/externalApi/rooms/TestRoomCode')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body.round).toBe(2);
  });
});

describe('POST /rooms/leave', () => {
  it('Removes a user from the room / Deletes the room if this is the last user', async () => {
    await request(app)
      .post('/externalApi/rooms/leave')
      .send({
        roomCode: 'TestRoomCode',
        playerId: '60e1b9b2a1c3c5c9f4d2e4b2',
      })
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

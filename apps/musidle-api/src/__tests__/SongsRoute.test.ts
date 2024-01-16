import request from 'supertest';
import { app } from '../index';
import { ISong } from '../@types/songs';

export const checkSongStructure = (song: ISong) => {
  expect(song).toHaveProperty('_id');
  expect(song).toHaveProperty('category');
  expect(song).toHaveProperty('wasInDaily');
  expect(song).toHaveProperty('value');
  expect(song).toHaveProperty('songId');
  expect(song).toHaveProperty('key');
};

describe('GET /songs', () => {
  it('responds with a list of songs', async () => {
    const response = await request(app)
      .get('/externalApi/songs')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.songs).toBeInstanceOf(Array);

    response.body.songs.forEach((song: ISong) => {
      checkSongStructure(song);
    });
  });
});

describe('POST /songs', () => {
  it('responds with a newly created song', async () => {
    const response = await request(app).post('/externalApi/songs').send({
      artist: 'TestArtist',
      category: 'TestCategory',
      value: 'TestValue',
      songId: 'TestSongId',
      key: 'TestKey',
    });

    expect(response.status).toBe(200);
    checkSongStructure(response.body.song);
  });
});

describe('GET /songs/:songId', () => {
  it('gets a songId and returns a song with that id', async () => {
    const response = await request(app)
      .get('/externalApi/songs/TestSongId')
      .expect('Content-Type', /json/)
      .expect(200);

    checkSongStructure(response.body.song);
  });
});

describe('DELETE /songs/:songId', () => {
  it('gets a songId and deletes a song with that id', async () => {
    await request(app).delete(`/externalApi/songs/TestSongId`).expect(204);
  });
});

describe('POST /songs/possibleSongs', () => {
  it('gets maxRoundsPhaseOne and maxRoundsPhaseTwo and returns a list of songs', async () => {
    const response = await request(app)
      .post('/externalApi/songs/possibleSongs')
      .send({
        maxRoundsPhaseOne: 4,
        maxRoundsPhaseTwo: 2,
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.songs).toBeInstanceOf(Array);

    response.body.songs.forEach((song: ISong) => {
      checkSongStructure(song);
    });
  });
});

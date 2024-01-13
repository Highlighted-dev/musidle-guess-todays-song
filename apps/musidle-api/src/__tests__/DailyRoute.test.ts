import request from 'supertest';
import { app } from '../index';

describe('GET /daily', () => {
  it('responds with a daily song', async () => {
    const response = await request(app)
      .get('/externalApi/daily')
      .expect('Content-Type', /json/)
      .expect(200);

    // Check the structure of the song
    expect(response.body).toHaveProperty('song');
    expect(response.body.song).toHaveProperty('_id');
    expect(response.body.song).toHaveProperty('value');
    expect(response.body.song).toHaveProperty('songId');
    expect(response.body.song).toHaveProperty('wasInDaily', false);
    expect(response.body.song).toHaveProperty('category');
  });
});

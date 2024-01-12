import request from 'supertest';
import { app } from '../index';
import { IGuild } from '../@types/guild';

const checkGuildStructure = (guild: IGuild) => {
  expect(guild).toHaveProperty('_id');
  expect(guild).toHaveProperty('name');
  expect(guild).toHaveProperty('members');
  expect(guild).toHaveProperty('description');
  expect(guild).toHaveProperty('leader');
  expect(guild.members).toBeInstanceOf(Array);
};

describe('POST /guilds', () => {
  it('responds with a newly created guild', async () => {
    const response = await request(app)
      .post('/externalApi/guilds')
      .send({
        _id: '60e1b9b2a1c3c5c9f4d2e4b2',
        name: 'TestGuild',
        description: 'TestGuildDescription',
        leader: {
          _id: '60e1b9b2a1c3c5c9f4d2e4b2',
          username: 'TestUser',
          email: 'TestUser123@gmail.com',
          role: 'admin',
          activated: true,
          guild: {
            _id: null,
            name: null,
          },
        },
        members: [
          {
            _id: '60e1b9b2a1c3c5c9f4d2e4b2',
            username: 'TestUser',
            email: 'TestUser123@gmail.com',
            role: 'admin',
            activated: true,
            guild: {
              _id: null,
              name: null,
            },
          },
        ],
      })
      .expect('Content-Type', /json/)
      .expect(201);

    checkGuildStructure(response.body);
  });
});

describe('GET /guilds', () => {
  it('checks the structure of all guilds', async () => {
    const response = await request(app)
      .get('/externalApi/guilds')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);

    // Check the structure of all guilds
    response.body.forEach((guild: IGuild) => {
      checkGuildStructure(guild);
    });
  });
});

describe('GET /guilds/:name', () => {
  it('responds with a specific guild', async () => {
    const name = 'TestGuild';
    const response = await request(app)
      .get(`/externalApi/guilds/${name}`)
      .expect('Content-Type', /json/)
      .expect(200);

    checkGuildStructure(response.body);
  });
});

describe('PUT /guilds/:name', () => {
  it('responds with an updated guild', async () => {
    const response = await request(app)
      .put('/externalApi/guilds/TestGuild')
      .send({
        name: 'TestGuild changed',
        description: 'TestGuildDescription changed',
        leader: {
          _id: '60e1b9b2a1c3c5c9f4d2e4b2',
          username: 'TestUser changed',
          email: 'TestUser123@gmail.com',
          role: 'admin',
          activated: true,
          guild: {
            _id: null,
            name: null,
          },
        },
        members: [
          {
            _id: '60e1b9b2a1c3c5c9f4d2e4b2',
            username: 'TestUser changed',
            email: 'TestUser123@gmail.com',
            role: 'admin',
            activated: true,
            guild: {
              _id: null,
              name: null,
            },
          },
        ],
      })
      .expect('Content-Type', /json/)
      .expect(200);

    checkGuildStructure(response.body);

    expect(response.body.name).toBe('TestGuild changed');
    expect(response.body.description).toBe('TestGuildDescription changed');
    expect(response.body.leader.username).toBe('TestUser changed');
    expect(response.body.members[0].username).toBe('TestUser changed');
  });
});

describe('DELETE /guilds/:name', () => {
  it('responds with a deleted guild', async () => {
    await request(app).delete('/externalApi/guilds/TestGuild changed').expect(204);
  });
});

// tests/integration/users.int.test.js
const express = require('express');
const request = require('supertest');
const createUserRoutes = require('../../src/routes/users');

// A tiny in-memory "service" for integration feel
function makeMemoryUserService(seed = []) {
  const map = new Map(seed.map(u => [u.id, u]));
  return {
    async getById(id) {
      return map.get(id) || null;
    }
  };
}

function makeApp(seedUsers = []) {
  const app = express();
  app.use(express.json());
  const userService = makeMemoryUserService(seedUsers);
  app.use('/api', createUserRoutes(userService));
  return app;
}

describe('GET /api/users/:id (integration)', () => {
  test('happy path returns user', async () => {
    const app = makeApp([{ id: 1, name: 'Grace Hopper' }]);
    const res = await request(app)
      .get('/api/users/1')
      .set('Authorization', 'Bearer integration');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { id: 1, name: 'Grace Hopper' } });
  });

  test('not found path', async () => {
    const app = makeApp([{ id: 2, name: 'Linus Torvalds' }]);
    const res = await request(app)
      .get('/api/users/3')
      .set('Authorization', 'Bearer integration');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });

  test('invalid id yields 400 early', async () => {
    const app = makeApp([{ id: 2, name: 'Linus Torvalds' }]);
    const res = await request(app)
      .get('/api/users/NaN')
      .set('Authorization', 'Bearer integration');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid user id' });
  });

  test('401 without token', async () => {
    const app = makeApp([{ id: 2, name: 'Linus Torvalds' }]);
    const res = await request(app).get('/api/users/2');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Missing or invalid token' });
  });
});

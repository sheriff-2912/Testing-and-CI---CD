// tests/unit/auth.edgecases.test.js
const createUserRoutes = require('../../src/routes/users');
const express = require('express');
const request = require('supertest');

function makeAppWith(userService) {
  const app = express();
  app.use('/api', createUserRoutes(userService));
  return app;
}

describe('Authorization edge cases', () => {
  test('lowercase bearer is rejected (current impl)', async () => {
    const app = makeAppWith({ getById: jest.fn() });
    const res = await request(app)
      .get('/api/users/1')
      .set('Authorization', 'bearer token'); // lowercase
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Missing or invalid token' });
  });

  test('extra whitespace around token still rejected (strict impl)', async () => {
    const app = makeAppWith({ getById: jest.fn() });
    const res = await request(app)
      .get('/api/users/1')
      .set('Authorization', 'Bearer    spaced');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Missing or invalid token' });
  });

  test('very large ID handled as valid integer', async () => {
    const user = { id: 9007199254740991, name: 'Big ID' }; // Number.MAX_SAFE_INTEGER
    const svc = { getById: jest.fn().mockResolvedValue(user) };
    const app = makeAppWith(svc);

    const res = await request(app)
      .get('/api/users/9007199254740991')
      .set('Authorization', 'Bearer t');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: user });
  });
});

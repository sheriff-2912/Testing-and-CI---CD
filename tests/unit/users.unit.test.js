// tests/unit/users.unit.test.js
const createUserRoutes = require('../../src/routes/users');
const express = require('express');
const request = require('supertest');

function makeAppWith(userService) {
  const app = express();
  app.use(express.json());
  app.use('/api', createUserRoutes(userService));
  // error handler (safety): not strictly needed because route catches its own errors
  app.use((err, req, res, next) => res.status(500).json({ error: 'boom' }));
  return app;
}

describe('GET /api/users/:id (unit via DI)', () => {
  test('400 when id is invalid', async () => {
    const userService = { getById: jest.fn() };
    const app = makeAppWith(userService);

    const res = await request(app).get('/api/users/abc'); // invalid id
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid user id' });
    expect(userService.getById).not.toHaveBeenCalled();
  });

  test('401 when Authorization header missing', async () => {
    const userService = { getById: jest.fn() };
    const app = makeAppWith(userService);

    const res = await request(app).get('/api/users/1'); // no header
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Missing or invalid token' });
  });

  test('401 when Authorization header malformed', async () => {
    const userService = { getById: jest.fn() };
    const app = makeAppWith(userService);

    const res = await request(app)
      .get('/api/users/1')
      .set('Authorization', 'Token xyz'); // wrong scheme
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Missing or invalid token' });
  });

  test('404 when user not found', async () => {
    const userService = { getById: jest.fn().mockResolvedValue(null) };
    const app = makeAppWith(userService);

    const res = await request(app)
      .get('/api/users/42')
      .set('Authorization', 'Bearer testtoken');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
    expect(userService.getById).toHaveBeenCalledWith(42);
  });

  test('200 when user exists', async () => {
    const fakeUser = { id: 7, name: 'Ada Lovelace' };
    const userService = { getById: jest.fn().mockResolvedValue(fakeUser) };
    const app = makeAppWith(userService);

    const res = await request(app)
      .get('/api/users/7')
      .set('Authorization', 'Bearer testtoken');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: fakeUser });
    expect(userService.getById).toHaveBeenCalledWith(7);
  });

  test('503 when service throws with status', async () => {
    const err = new Error('upstream down');
    Object.assign(err, { status: 503 });
    const userService = { getById: jest.fn().mockRejectedValue(err) };
    const app = makeAppWith(userService);

    const res = await request(app)
      .get('/api/users/1')
      .set('Authorization', 'Bearer testtoken');
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });

  test('500 when service throws without status', async () => {
    const userService = { getById: jest.fn().mockRejectedValue(new Error('oops')) };
    const app = makeAppWith(userService);

    const res = await request(app)
      .get('/api/users/1')
      .set('Authorization', 'Bearer testtoken');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });
});

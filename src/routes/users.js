// src/routes/users.js
const express = require('express');
const router = express.Router();

/**
 * Factory: inject a userService to make unit testing easy.
 * userService must expose: getById(id:number) -> Promise<User|null>
 */
module.exports = function createUserRoutes(userService) {
  router.get('/users/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid user id' });
      }

      // Optional auth (demonstrates 401 path)
      const auth = req.header('Authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid token' });
      }

      const user = await userService.getById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json({ data: user });
    } catch (err) {
      // Allow service to attach a status code (e.g., 503)
      const status = Number(err?.status) || 500;
      return res.status(status).json({ error: 'Internal server error' });
    }
  });

  return router;
};

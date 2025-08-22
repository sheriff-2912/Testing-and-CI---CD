# AI Testing Assignment — Ready-to-Run

A compact Express service example used to demonstrate unit and integration testing with Jest and Supertest, plus a CI pipeline that runs tests and uploads coverage.

## Quick summary

- Minimal Express route factory under test: [`createUserRoutes`](src/routes/users.js).
- Tests: unit and integration tests that exercise validation, authorization, and error handling using dependency injection.
- CI: GitHub Actions workflow runs tests on multiple Node versions and uploads coverage.

## Requirements

- Node.js >= 18 (see [.nvmrc](.nvmrc)).
- npm (comes with Node.js).

## Project layout

- [src/routes/users.js](src/routes/users.js) — The route factory exported as [`createUserRoutes`](src/routes/users.js).
- tests/
  - [tests/unit/users.unit.test.js](tests/unit/users.unit.test.js) — Unit tests that inject fake services.
  - [tests/unit/auth.edgecases.test.js](tests/unit/auth.edgecases.test.js) — Edge cases for authorization and IDs.
  - [tests/integration/users.int.test.js](tests/integration/users.int.test.js) — Integration-style tests with an in-memory service (see [`makeMemoryUserService`](tests/integration/users.int.test.js)).
- jest.config.js — Jest configuration used by the test runner.
- package.json — Scripts and dependencies.

## Behavior overview

- Endpoint: GET /api/users/:id
  - Validates id: must parse to a positive integer. Invalid -> 400 { error: 'Invalid user id' }.
  - Requires Authorization header starting exactly with `Bearer ` (case-sensitive). Missing/malformed -> 401 { error: 'Missing or invalid token' }.
  - Looks up user with injected `userService.getById(id)`.
    - Not found -> 404 { error: 'User not found' }.
    - Found -> 200 { data: <user> }.
  - Service errors: if the thrown error has a `.status` numeric property it is used, otherwise 500. Response body for server errors: { error: 'Internal server error' }.

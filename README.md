# AI Testing Assignment (Ready-to-Run)

## Quickstart
1) Install Node.js 18 or 20 (recommend 20).
2) In this folder, run:
   ```bash
   npm install
   npm test
   ```

3) Push to GitHub. The included workflow `.github/workflows/ci.yml` will run tests on Node 18 and 20 and upload coverage.

## Structure
- `src/routes/users.js` – Express route factory under test.
- `tests/` – Jest unit & integration tests (including edge cases).
- `.github/workflows/ci.yml` – GitHub Actions pipeline.
- `jest.config.js` – Jest configuration.

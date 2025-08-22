## Reflection

Using AI here felt like pair-programming with someone who never gets tired of enumerating edge cases. For Activity 1, the assistant quickly mapped the expected response matrix (200/400/401/404/500+) and scaffolded both unit and integration tests. The drafts were decent, but I had to correct a few common oversights: missing `await` on `supertest` calls, enforcing the exact `Bearer` scheme for 401 behavior, and making sure thrown errors could carry a status (e.g., 503). Once fixed, the tests read cleanly and covered the real behaviors I care about.

For Activity 2, the GitHub Actions YAML was mostly right on the first pass. I asked for caching and coverage artifacts, and it generated a minimal, fast pipeline that worked without hand-holding.

For Activity 3, the AI nudged me toward practical gaps I might have ignored—like header case sensitivity, whitespace quirks, and large numeric IDs. I kept the route intentionally strict (rejecting lowercase “bearer”) to avoid ambiguous auth parsing and documented that choice in tests. Overall, AI accelerated coverage while I stayed in control of correctness and API contracts.

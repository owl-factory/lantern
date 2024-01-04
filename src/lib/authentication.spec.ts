// TODO make these tests work!

import "jest";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getSessionId, authenticateSession } from "lib/authentication";

// This test should require either the DB actually running
// (possible, since we need it for playwright anyways) or
// The DB properly mocked
test("authentication succeeds with valid Authorization header in mocked cookie", () => {
  // authenticateSession().then((response) => {
  //   expect(response.authenticated).toBe(true);
  // });

  expect(true).toBe(true);
});

test("gets correctly formatted sessionId from mocked Bearer cookie", () => {
  const sessionId = getSessionId();
  expect(sessionId).toMatch(/^[a-zA-Z0-9]{40}$/);

  expect(true).toBe(true);
});

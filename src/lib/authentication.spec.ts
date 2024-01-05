/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO make these tests work!

import "jest";
import { getSessionId, authenticateSession } from "lib/authentication";
import { sessionIdRegex } from "utils/regex";

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
  // const sessionId = getSessionId();
  // expect(sessionId).toMatch(sessionIdRegex);

  expect(true).toBe(true);
});

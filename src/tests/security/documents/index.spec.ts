import { Auth } from "controllers/auth";
import { isOwner } from "security/documents";

const doc = {
  ref: "1",
  ownedBy: {
    ref: "a",
  },
};

describe("isOwner", () => {
  test("no doc", () => {
    const res = isOwner();
    expect(res).toBeFalsy();
  });

  test("no login", () => {
    Auth.reset();
    const res = isOwner(doc);
    expect(res).toBeFalsy();
  });

  test("not Owner", () => {
    Auth.fromAPI(
      { ref: "b" } as any,
      "",
      ""
    );
    const res = isOwner(doc);
    expect(res).toBeFalsy();
  });

  test("Owner", () => {
    Auth.fromAPI(
      { ref: "a" } as any,
      "",
      ""
    );
    const res = isOwner(doc);
    expect(res).toBeTruthy();
    Auth.reset();
  });
});

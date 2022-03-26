import { create, fetch, remove, update } from "server/logic/access";

jest.mock("@owl-factory/database/integration/fauna");

const doc = { ref: "1", name: "testDoc" };

describe("create", () => {
  test("success", async () => {
    const res = await create("test", doc);
    expect(res).toStrictEqual(doc);
  });
});

describe("remove", () => {
  test("success", async () => {
    const res = await remove("test", doc.ref);
    expect(res).toStrictEqual({ ref: doc.ref });
  });
});

describe("fetch", () => {
  test("success", async () => {
    const res = await fetch("test", doc.ref);
    expect(res).toStrictEqual({ ref: doc.ref });
  });
});

describe("update", () => {
  test("success", async () => {
    const res = await update("test", doc.ref, doc);
    expect(res).toStrictEqual(doc);
  });
});

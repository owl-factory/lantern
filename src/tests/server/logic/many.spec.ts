import { createMany, deleteMany, fetchMany, updateMany } from "server/logic/many";

describe("createMany", () => {
  test("success", async () => {
    const create = jest.fn(async (doc: any) => doc);
    const docs = [ {}, {}, {} ];
    const res = await createMany(create, docs);
    expect(res.length).toBe(3);
    expect(create).toBeCalledTimes(3);
  });
});


describe("deleteMany", () => {
  test("success", async () => {
    const del = jest.fn(async (ref: any) => ({ ref }));
    const refs = [ "1", "2", "3" ];
    const res = await deleteMany(del, refs);
    expect(res.length).toBe(3);
    expect(del).toBeCalledTimes(3);
  });
});

describe("fetchMany", () => {
  test("success", async () => {
    const fetch = jest.fn(async (ref: any) => ({ ref }));
    const refs = [ "1", "2", "3" ];
    const res = await fetchMany(fetch, refs);
    expect(res.length).toBe(3);
    expect(fetch).toBeCalledTimes(3);
  });
});

describe("updateMany", () => {
  test("success", async () => {
    const update = jest.fn(async (_ref: string, doc: any) => doc);
    const packets = [ {ref: "1", doc: {}}, {ref: "2", doc: {}}, {ref: "3", doc: {}} ];
    const res = await updateMany(update, packets);
    expect(res.length).toBe(3);
    expect(update).toBeCalledTimes(3);
  });
});

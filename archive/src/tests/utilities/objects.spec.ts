import { read, set } from "../../utilities/objects";


test("read", () => {
  const obj = { a: { b: { c: 1 }}};
  const value = read(obj, "a.b.c");

  expect(value).toBe(1);
});

test("read undefined value", () => {
  const obj = { a: { b: { c: 1 }}};
  const value = read(obj, "a.b.d");

  expect(value).toBe(undefined);
});

test("set", () => {
  const obj = { a: { b: { c: 1 }}};
  const newObj = set(obj, "a.b.c", 2) as any;

  expect(newObj.a.b.c).toBe(2);
});

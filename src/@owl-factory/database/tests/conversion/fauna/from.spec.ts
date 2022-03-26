import { query as q } from "faunadb";
import {
  $fromArray,
  $fromDate,
  $fromItem,
  $fromRecord,
  $getFaunaDataType,
  $isFaunaRef,
} from "@owl-factory/database/conversion/fauna/from";

test("fromArray", () => {
  const arr = [ "a", "b" ];
  expect($fromArray(arr)).toStrictEqual(arr);
});

test("fromDate test", () => {
  const baseDate = new Date();
  const faunaTime = { "@ts": baseDate.toISOString() };
  const date = $fromDate(faunaTime);
  expect(date).toStrictEqual(baseDate.toISOString());
});

test("fromRecord test", () => {
  const obj = { a: "b" };

  expect($fromRecord(obj)).toStrictEqual(obj);
});

test("fromItem", () => {
  const bool = true;
  const num = 1;
  const str = "str";

  const arr = [ "a", "b" ];
  const obj = { a: "b" };

  expect($fromItem(bool)).toBe(bool);
  expect($fromItem(num)).toBe(num);
  expect($fromItem(str)).toBe(str);

  expect($fromItem(undefined)).toBe(undefined);

  expect($fromItem(arr)).toStrictEqual(arr);

  expect($fromItem(obj)).toStrictEqual(obj);
});

test("getFaunaDataType", () => {
  expect($getFaunaDataType(undefined)).toBe("undefined");
  expect($getFaunaDataType("a")).toBe("string");
  expect($getFaunaDataType(1)).toBe("number");
  expect($getFaunaDataType(true)).toBe("boolean");
  expect($getFaunaDataType(["a"])).toBe("array");
  // TODO - what fauna gives back and what this takes are different :/
  // expect($getFaunaDataType(q.Ref(q.Collection("collection"), "id"))).toBe("ref");
  // expect($getFaunaDataType(q.Date(((new Date()).toISOString())))).toBe("date");
  expect($getFaunaDataType({ a: "b" })).toBe("object");
});

test("isFaunaRef", () => {
  const faunaRef1 = { "@ref": {} };
  const faunaRef2 = { value: { id: "a" } };
  expect($isFaunaRef(faunaRef1)).toBe(true);
  expect($isFaunaRef(faunaRef2)).toBe(true);
});

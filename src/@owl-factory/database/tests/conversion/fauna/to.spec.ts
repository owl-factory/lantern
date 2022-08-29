import { $toArray, $toDate, $toItem } from "@owl-factory/database/utilities/conversion/fauna/to";
import { query as q } from "faunadb";

test("toArray test", () => {
  const arr = [ "a", "b" ];
  const objectArr = [ { ref: "hi" }, { ref: "bye" } ];

  const faunaArr = $toArray(arr);
  const faunaObjectArr = $toArray(objectArr);

  expect(faunaArr).toStrictEqual(arr);
  expect(faunaObjectArr).toStrictEqual(objectArr);
  // TODO - add date testing
});

test("toDate test", () => {
  const date = new Date();
  const faunaDate = $toDate(date);
  const expectedDate = q.Time(date.toISOString());

  expect(faunaDate).toStrictEqual(expectedDate);
});

test("toItem test simple type", () => {
  expect($toItem(true)).toBe(true);
  expect($toItem(5)).toBe(5);
  expect($toItem("abc")).toBe("abc");
  expect($toItem(undefined)).toBe(undefined);
});

test("toItem array", () => {
  const arr = [ "1", "2" ];
  const faunaArr = $toArray(arr);
  expect($toItem(arr)).toStrictEqual(faunaArr);
});

test("toItem date", () => {
  const date = new Date();
  const faunaDate = $toDate(date);

  expect($toItem(date)).toStrictEqual(faunaDate);
});

test("toItem ref", () => {
  // TODO
});


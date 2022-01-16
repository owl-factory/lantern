import { $getUniquesFromObjects, $getUniquesFromSimpleTypes, arrayToList, getUniques } from "../arrays";

test("Converts an array to list", () => {
  const arr = ["a", "b", "c"];
  const list = arrayToList(arr);
  expect(list).toBe("a, b, c");
});

test("arrayToList list undefined", () => {
  const list = arrayToList();
  expect(list).toBe("");
});

// This for coverage
test("getUniques with empty array", () => {
  const arr = getUniques([], "key");
  expect(arr.length).toBe(0);
});

test("Gets the unique elements of an array of simple values", () => {
  const messyArray = [1, 2, 3, 2, 3, 3];
  const uniqueArray = $getUniquesFromSimpleTypes(messyArray);
  const uniqueArrayBase = getUniques(messyArray);
  expect(uniqueArray).toStrictEqual([1, 2, 3]);
  expect(uniqueArray).toStrictEqual(uniqueArrayBase);
});

test("Gets the unique elements of an array of objects", () => {
  const messyArray = [
    { key: 1 },
    { key: 1 },
    { key: 2 },
  ];
  const uniqueArray = $getUniquesFromObjects(messyArray, "key");
  const uniqueArrayBase = getUniques(messyArray, "key");
  expect(uniqueArray).toStrictEqual([1, 2]);
  expect(uniqueArray).toStrictEqual(uniqueArrayBase);
});

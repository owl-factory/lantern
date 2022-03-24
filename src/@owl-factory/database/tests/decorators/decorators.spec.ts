import { Create, Delete, Fetch, Search, Update } from "@owl-factory/database/decorators/decorators";
import { read } from "fs";

describe("Decorators", () => {
  const collection = "collection";
  const readFields = ["read"];
  const setFields = ["set"];
  const validation = (doc: any) => [];
  const fetchFunction = async (ref: string) => undefined;

  let descriptor: any;

  beforeEach(() => {
    descriptor = { value: () => undefined };
  });

  test("Create", () => {
    const fx = Create(readFields, setFields, validation);
    fx(null, "", descriptor);

    expect(descriptor.readFields).toStrictEqual(readFields);
    expect(descriptor.setFields).toStrictEqual(setFields);
    expect(descriptor.validateDocument).toStrictEqual(validation);
  });

  test("Delete", () => {
    const fx = Delete(collection, readFields, fetchFunction);
    fx(null, "", descriptor);

    expect(descriptor.collection).toStrictEqual(collection);
    expect(descriptor.readFields).toStrictEqual(readFields);
    expect(descriptor.fetch).toStrictEqual(fetchFunction);
  });

  test("Fetch", () => {
    const fx = Fetch(collection, readFields);
    fx(null, "", descriptor);

    expect(descriptor.collection).toStrictEqual(collection);
    expect(descriptor.readFields).toStrictEqual(readFields);
  });

  test("Search", () => {
    const fx = Search(readFields);
    fx(null, "", descriptor);

    expect(descriptor.readFields).toStrictEqual(readFields);
  });

  test("Update", () => {
    const fx = Update(collection, readFields, setFields, fetchFunction, validation);
    fx(null, "", descriptor);

    expect(descriptor.collection).toStrictEqual(collection);
    expect(descriptor.readFields).toStrictEqual(readFields);
    expect(descriptor.setFields).toStrictEqual(setFields);
    expect(descriptor.fetch).toStrictEqual(fetchFunction);
    expect(descriptor.validateDocument).toStrictEqual(validation);
  });
});

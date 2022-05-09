import { getDefaultDocument, getMigrations, getVersion } from "@owl-factory/database/migrations/fauna/access";
import { defaultDocuments, migrations, versions } from "@owl-factory/database/migrations/fauna/data";
import { MigrationAction, RawMigration, RawMigrationAction } from "@owl-factory/database/types/migrations/fauna";

describe("getVersion", () => {
  const collection = "test";
  test("with version", () => {
    versions[collection] = "1.0.0";
    const res = getVersion(collection);
    delete versions[collection];

    expect(res).toBe("1.0.0");
  });

  test("without version", () => {
    const res = getVersion(collection);
    expect(res).toBe("0.0.0");
  });
});

describe("getDefaultDocument", () => {
  const collection = "test";
  const testDoc = { name: "testName", _v: "2.1.2" };
  test("with doc", () => {
    defaultDocuments[collection] = testDoc;
    const res = getDefaultDocument(collection);
    delete defaultDocuments[collection];

    expect(res).toStrictEqual(testDoc);
  });
});

describe("getMigrations", () => {
  const collection = "test";
  const testMigrations: RawMigration[] = [{
    version: "1.2.1",
    fields: { name: [] },
  }];
  test("with doc", () => {
    migrations[collection] = testMigrations;
    const res = getMigrations(collection);
    delete migrations[collection];

    expect(res).toStrictEqual(testMigrations);
  });

  test("without doc", () => {
    const res = getMigrations(collection);
    expect(res).toStrictEqual([]);
  });
});

import { getMigrationFilenames } from "@owl-factory/database/migrations/fauna/file";
import fs from "fs";

jest.mock("fs");

describe("getMigrationFilenames", () => {
  test("no path", () => {
    (fs.existsSync as any).mockImplementationOnce((_path: string) => ["v1.0.0.yml"])
    console.log(fs.existsSync("does-not-exist"))
    const res = getMigrationFilenames("does-not-exist");
    console.log(res);
  })
});
import { MOCK_URL } from "@owl-factory/https/__mocks__/rest";
import { create, del, read, update } from "../crud";

jest.mock("@owl-factory/https/rest");

describe("create", () => {
  test("create success", async () => {
    const result = await create<any>(MOCK_URL.SUCCESS, [ {} ]);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });

  test("create fail", async () => {
    const result = await create<any>(MOCK_URL.FAIL, [ {} ]);
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });

  test("create error", async () => {
    const result = await create<any>(MOCK_URL.ERROR, [ {} ]);
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });
});

describe("read", () => {
  test("read success", async () => {
    const result = await read<any>(MOCK_URL.SUCCESS, [ "1" ]);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });

  test("read fail", async () => {
    const result = await read<any>(MOCK_URL.FAIL, [ "1" ]);
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });

  test("read error", async () => {
    const result = await read<any>(MOCK_URL.ERROR, [ "1" ]);
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });
});

describe("update", () => {
  test("update success", async () => {
    const result = await update<any>(MOCK_URL.SUCCESS, [ {} ]);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });

  test("update fail", async () => {
    const result = await update<any>(MOCK_URL.FAIL, [ {} ]);
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });

  test("update error", async () => {
    const result = await update<any>(MOCK_URL.ERROR, [ {} ]);
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });
});

describe("delete", () => {
  test("delete success", async () => {
    const result = await del<any>(MOCK_URL.SUCCESS, [ "1" ]);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });

  test("delete fail", async () => {
    const result = await del<any>(MOCK_URL.FAIL, [ "1" ]);
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });

  test("delete error", async () => {
    const result = await del<any>(MOCK_URL.ERROR, [ "1" ]);
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });
});

// jest.unmock("@owl-factory/https/rest");

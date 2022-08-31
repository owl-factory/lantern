import { Dynamic, RequireLogin, Static } from "@owl-factory/database/utilities/decorators/modifiers";

describe("RequireLogin", () => {
  let descriptor: any;

  beforeEach(() => {
    descriptor = {};
  });

  test("RequireLogin", () => {
    const fx = RequireLogin(true);
    fx(null, "", descriptor);
    expect(descriptor.requireLogin).toBe(true);
  });
});

describe("Dynamic", () => {
  let descriptor: any;

  beforeEach(() => {
    descriptor = {};
  });

  test("Dynamic", () => {
    const fx = Dynamic((doc) => "");
    fx(null, "", descriptor);
    expect(descriptor.dynamicAccess).toBeDefined();
  });
});

describe("Static", () => {
  let descriptor: any;

  beforeEach(() => {
    descriptor = {};
  });

  test("Static", () => {
    const fx = Static(() => "");
    fx(null, "", descriptor);
    expect(descriptor.staticAccess).toBeDefined();
  });
});

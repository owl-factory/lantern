import {
  setCreateFields,
  setUpdateFields,
  trimReadFields,
  trimSetFields,
  validateDocument,
  validateDynamicAccess,
  validateLogin,
  validateStaticAccess,
} from "@owl-factory/database/decorators/actions";
import { LogicDescriptor } from "@owl-factory/database/decorators/types";
import { Auth } from "controllers/auth";
import { UserDocument } from "types/documents";


describe("validateDynamicAccess", () => {
  let descriptor: LogicDescriptor;
  let doc: any;

  let mockCacheAction: ((doc: any) => string | undefined) | undefined;

  const value = {
    apply: mockCacheAction,
  };

  beforeEach(() => {
    descriptor = {
      collection: "test",
      readFields: ["*"],
      value,
    };
    doc = { id: "1" };

    mockCacheAction = jest.fn((mockDoc: any) => {
      if (mockDoc.id === "2") { return "error"; }
      return;
    });
  });

  test("No dynamic value", () => {
    validateDynamicAccess(descriptor, doc);
    expect(mockCacheAction).toBeCalledTimes(0);
  });

  test("Successful run", () => {
    descriptor.dynamicAccess = mockCacheAction;
    validateDynamicAccess(descriptor, doc);
    expect(mockCacheAction).toBeCalledTimes(1);
  });

  test("Run with error", () => {
    doc.id = "2";
    descriptor.dynamicAccess = mockCacheAction;

    expect(() => validateDynamicAccess(descriptor, doc)).toThrow("error");
    expect(mockCacheAction).toBeCalledTimes(1);
  });
});


describe("validateStaticAccess", () => {
  let descriptor: LogicDescriptor;
  let doThrow = false;

  let mockCacheAction: any;

  const value = {
    apply: mockCacheAction,
  };

  beforeEach(() => {
    descriptor = {
      collection: "test",
      readFields: ["*"],
      value,
    };

    mockCacheAction = jest.fn(() => {
      if (doThrow) { return "error"; }
      return;
    });
  });

  test("No descriptor value", () => {
    validateStaticAccess(descriptor);
    expect(mockCacheAction).toBeCalledTimes(0);
  });

  test("Successful run", () => {
    descriptor.staticAccess = mockCacheAction;
    validateStaticAccess(descriptor);
    expect(mockCacheAction).toBeCalledTimes(1);
  });

  test("Run with error", () => {
    descriptor.staticAccess = mockCacheAction;
    doThrow = true;
    expect(() => validateStaticAccess(descriptor)).toThrow("error");
    expect(mockCacheAction).toBeCalledTimes(1);
  });
});


describe("validateDocument", () => {
  let descriptor: LogicDescriptor;
  let doc: any;

  let mockCacheAction: ((doc: any) => string[] | undefined) | undefined;

  const value = {
    apply: mockCacheAction,
  };

  beforeEach(() => {
    descriptor = {
      collection: "test",
      readFields: ["*"],
      value,
    };
    doc = { id: "1" };

    mockCacheAction = jest.fn((mockDoc: any) => {
      const errors: string[] = [];
      if (mockDoc.id === "2") { errors.push("error"); }
      return errors;
    });
  });

  test("No descriptor value", () => {
    validateDocument(descriptor, doc);
    expect(mockCacheAction).toBeCalledTimes(0);
  });

  test("Successful run", () => {
    descriptor.validation = mockCacheAction;
    validateDocument(descriptor, doc);
    expect(mockCacheAction).toBeCalledTimes(1);
  });

  test("Run with errors", () => {
    doc.id = "2";
    descriptor.validation = mockCacheAction;

    expect(() => validateDocument(descriptor, doc)).toThrow("error");
    expect(mockCacheAction).toBeCalledTimes(1);
  });
});

describe("validateLogin", () => {
  let descriptor: LogicDescriptor;

  const value = {
    apply: () => undefined,
  };

  beforeEach(() => {
    descriptor = {
      collection: "test",
      readFields: ["*"],
      requireLogin: true,
      value,
    };
  });

  test("No login value", () => {
    expect(() => validateLogin(descriptor)).toThrow("You must be logged in to access the test collection");
  });
});

describe("setCreateFields", () => {
  test("created, no log in", () => {
    Auth.reset();

    const doc = setCreateFields({});
    const ref = { ref: "" };

    expect(doc.createdAt).toBeDefined();
    expect(doc.createdBy).toStrictEqual(ref);
    expect(doc.ownedBy).toStrictEqual(ref);

    expect(doc.updatedAt).toBeDefined();
    expect(doc.updatedBy).toStrictEqual(ref);
  });

  test("created, logged in", () => {
    const user = createTestUserDocument();
    const ref = { ref: user.ref };
    Auth.fromAPI(user, "", "");
    const doc = setCreateFields({});

    expect(doc.createdBy).toStrictEqual(ref);
    expect(doc.ownedBy).toStrictEqual(ref);

    expect(doc.updatedBy).toStrictEqual(ref);
  });
});

describe("setUpdateFields", () => {
  test("updated, no log in", () => {
    Auth.reset();
    const doc = setUpdateFields({});
    const ref = { ref: "" };

    expect(doc.createdAt).toBeUndefined();
    expect(doc.createdBy).toBeUndefined();
    expect(doc.ownedBy).toBeUndefined();

    expect(doc.updatedAt).toBeDefined();
    expect(doc.updatedBy).toStrictEqual(ref);
  });

  test("updated, logged in", () => {
    const user = createTestUserDocument();
    const ref = { ref: user.ref };
    Auth.fromAPI(user, "", "");
    const doc = setUpdateFields({});
    expect(doc.updatedBy).toStrictEqual(ref);
  });
});

describe("Trim Read Fields", () => {
  let descriptor: LogicDescriptor;
  let doc: any;

  let mockCacheAction: ((doc: any) => string[] | undefined) | undefined;

  const value = {
    apply: mockCacheAction,
  };

  beforeEach(() => {
    descriptor = {
      collection: "test",
      readFields: ["*"],
      value,
    };
    doc = { id: "1" };

    mockCacheAction = jest.fn((mockDoc: any) => {
      const errors: string[] = [];
      if (mockDoc.id === "2") { errors.push("error"); }
      return errors;
    });
  });

  test("Missing Read Field", () => {
    (descriptor as any).readFields = undefined;
    expect(() => trimReadFields(descriptor, doc)).toThrow();
  });

  test("Trim Read Fields from Array", () => {
    doc.test = "test";
    descriptor.readFields = ["id"];
    const result = trimReadFields(descriptor, doc);
    expect(result).toStrictEqual({ id: "1" });
  });

  test("Trim Read Fields from Func", () => {
    doc.test = "test";
    descriptor.readFields = (givenDoc: any) => ["id"];
    const result = trimReadFields(descriptor, doc);
    expect(result).toStrictEqual({ id: "1" });
  });
});

describe("Trim Set Fields", () => {
  let descriptor: LogicDescriptor;
  let doc: any;

  let mockCacheAction: ((doc: any) => string[] | undefined) | undefined;

  const value = {
    apply: mockCacheAction,
  };

  beforeEach(() => {
    descriptor = {
      collection: "test",
      readFields: ["*"],
      value,
    };
    doc = { id: "1" };

    mockCacheAction = jest.fn((mockDoc: any) => {
      const errors: string[] = [];
      if (mockDoc.id === "2") { errors.push("error"); }
      return errors;
    });
  });

  test("Missing Set Field", () => {
    expect(() => trimSetFields(descriptor, doc)).toThrow();
  });

  test("Trim Set Fields from Array", () => {
    doc.test = "test";
    descriptor.setFields = ["id"];
    const result = trimSetFields(descriptor, doc);
    expect(result).toStrictEqual({ id: "1" });
  });

  test("Trim Set Fields from Func", () => {
    doc.test = "test";
    descriptor.setFields = (givenDoc: any) => ["id"];
    const result = trimSetFields(descriptor, doc);
    expect(result).toStrictEqual({ id: "1" });
  });
});

function createTestUserDocument(): UserDocument {
  return {
    ref: "123",
    name: "TestingLady",
    username: "TestingLady",
    email: "fakeemail@mail.com",
    avatar: {
      src: "",
      ref: "",
    },
    role: "",
    permissions: [],
    recentPlayers: [],
    badges: [],
  };
}

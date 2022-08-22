import { LogicDescriptor } from "@owl-factory/database/utilities/decorators/types";
import {
  setCreateFields,
  trimReadFields,
  trimSetFields,
  validateDocument,
  validateDynamicAccess,
  validateLogin,
  validateStaticAccess,
} from "@owl-factory/database/utilities/decorators/actions";
import {
  createWrapper,
  deleteWrapper,
  fetchWrapper,
  updateWrapper,
} from "@owl-factory/database/utilities/decorators/wrappers";
import { isValidCollection, isValidRef } from "@owl-factory/data/utilities/fields";

import "@owl-factory/database/tests/mocks/decorators/actions";
import "@owl-factory/data/tests/mocks/helpers/fields";

jest.mock("@owl-factory/database/decorators/actions");
jest.mock("@owl-factory/database/integration/fauna");
jest.mock("@owl-factory/data/helpers/fields");

let descriptor: LogicDescriptor;
const doc = { ref: "2", collection: "test" };
const original = jest.fn(async () => (doc));

function resetMocks() {
  (validateLogin as any).mockClear();
  (validateStaticAccess as any).mockClear();
  (validateDynamicAccess as any).mockClear();
  (validateDocument as any).mockClear();
  (trimSetFields as any).mockClear();
  (setCreateFields as any).mockClear();
  (original as any).mockClear();
  (trimReadFields as any).mockClear();

  (isValidRef as any).mockClear();
  (isValidCollection as any).mockClear();

}

describe("createWrapper", () => {
  beforeEach(() => {
    descriptor = {
      collection: "test",
      readFields: ["*"],
      value: original,
    };

    resetMocks();
  });

  test("failed login", async () => {
    const err = "Login Error";
    (validateLogin as any).mockImplementationOnce((_desc: any) => {throw err;});

    const res = await createWrapper(descriptor, original, { ref: "2" });

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([err]);

    expect(validateLogin).toBeCalledTimes(1);
    expect(validateStaticAccess).toBeCalledTimes(0);
  });

  test("failed static access", async () => {
    const err = "Static Error";
    (validateStaticAccess as any).mockImplementationOnce((_desc: any) => {throw err;});

    const res = await createWrapper(descriptor, original, doc);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([err]);

    expect(validateLogin).toBeCalledTimes(1);
    expect(validateStaticAccess).toBeCalledTimes(1);
    expect(validateDocument).toBeCalledTimes(0);
  });

  test("failed document access", async () => {
    const err = "Document Error";
    (validateDocument as any).mockImplementationOnce((_desc: any) => {throw [err];});

    const res = await createWrapper(descriptor, original, doc);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([err]);

    expect(validateStaticAccess).toBeCalledTimes(1);
    expect(validateDocument).toBeCalledTimes(1);
    expect(original).toBeCalledTimes(0);
  });

  test("success", async () => {
    const res = await createWrapper(descriptor, original, doc);

    expect(res.success).toBeTruthy();
    expect(res.messages).toStrictEqual([]);
    expect(res.doc).toStrictEqual(doc);

    expect(original).toBeCalledTimes(1);
    expect(trimReadFields).toBeCalledTimes(1);
  });
});



describe("deleteWrapper", () => {
  beforeEach(() => {
    descriptor = {
      collection: "test",
      readFields: ["*"],
      value: original,
      fetch: jest.fn(async (ref: string) => doc),
    };

    resetMocks();
  });

  test("invalid ref", async () => {
    (isValidRef as any).mockImplementationOnce((_ref: any) => {return false;});

    const res = await deleteWrapper(descriptor, original, doc.ref);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([`The ref '${doc.ref}' is not valid`]);

    expect(isValidRef).toBeCalledTimes(1);
    expect(isValidCollection).toBeCalledTimes(0);
  });

  test("invalid collection", async () => {
    (isValidCollection as any).mockImplementationOnce((_ref: any, _expectedCollection?: string) => {return false;});

    const res = await deleteWrapper(descriptor, original, doc.ref);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([`The collection within '${doc.ref}' is not valid`]);

    expect(isValidCollection).toBeCalledTimes(1);
    expect(validateLogin).toBeCalledTimes(0);
  });

  test("failed login", async () => {
    const err = "Login Error";
    (validateLogin as any).mockImplementationOnce((_desc: any) => {throw err;});

    const res = await deleteWrapper(descriptor, original, doc.ref);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([err]);

    expect(validateLogin).toBeCalledTimes(1);
    expect(validateStaticAccess).toBeCalledTimes(0);
  });

  test("failed static access", async () => {
    const err = "Static Error";
    (validateStaticAccess as any).mockImplementationOnce((_desc: any) => {throw err;});

    const res = await deleteWrapper(descriptor, original, doc.ref);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([err]);

    expect(validateStaticAccess).toBeCalledTimes(1);
    expect(validateDocument).toBeCalledTimes(0);
  });

  test("no fetch", async () => {
    descriptor.fetch = undefined;
    const res = await deleteWrapper(descriptor, original, doc.ref);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([`A fetch function is required for the delete function`]);

    expect(validateStaticAccess).toBeCalledTimes(1);
    expect(validateDynamicAccess).toBeCalledTimes(0);
  });

  test("bad fetch", async () => {
    (descriptor.fetch as any).mockImplementationOnce((_ref: string) => undefined);
    const res = await deleteWrapper(descriptor, original, doc.ref);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([`A document with ref '${doc.ref}' could not be found`]);

    expect(descriptor.fetch).toBeCalledTimes(1);
    expect(validateDynamicAccess).toBeCalledTimes(0);
  });

  test("failed dynamic access", async () => {
    const err = "err";
    (validateDynamicAccess as any).mockImplementationOnce((_desc: LogicDescriptor, _doc: any) => {throw err;});
    const res = await deleteWrapper(descriptor, original, doc.ref);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([err]);

    expect(validateDynamicAccess).toBeCalledTimes(1);
    expect(original).toBeCalledTimes(0);
  });

  test("success", async () => {
    const res = await deleteWrapper(descriptor, original, doc.ref);

    expect(res.success).toBeTruthy();
    expect(res.messages).toStrictEqual([]);

    expect(original).toBeCalledTimes(1);
    expect(trimReadFields).toBeCalledTimes(1);

  });
});



describe("fetchWrapper", () => {
  beforeEach(() => {
    descriptor = {
      collection: "test",
      readFields: ["*"],
      value: original,
      fetch: jest.fn(async (ref: string) => doc),
    };

    resetMocks();
  });

  test("invalid ref", async () => {
    (isValidRef as any).mockImplementationOnce((_ref: any) => {return false;});

    const res = await fetchWrapper(descriptor, original, doc.ref);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([`The ref '${doc.ref}' is not valid`]);

    expect(isValidRef).toBeCalledTimes(1);
    expect(isValidCollection).toBeCalledTimes(0);
  });

  test("invalid collection", async () => {
    (isValidCollection as any).mockImplementationOnce((_ref: any, _expectedCollection?: string) => {return false;});

    const res = await fetchWrapper(descriptor, original, doc.ref);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([`The collection within '${doc.ref}' is not valid`]);

    expect(isValidCollection).toBeCalledTimes(1);
    expect(validateLogin).toBeCalledTimes(0);
  });

  test("failed login", async () => {
    const err = "Login Error";
    (validateLogin as any).mockImplementationOnce((_desc: any) => {throw err;});

    const res = await fetchWrapper(descriptor, original, doc.ref);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([err]);

    expect(validateLogin).toBeCalledTimes(1);
    expect(validateStaticAccess).toBeCalledTimes(0);
  });

  test("failed static access", async () => {
    const err = "Static Error";
    (validateStaticAccess as any).mockImplementationOnce((_desc: any) => {throw err;});

    const res = await fetchWrapper(descriptor, original, doc.ref);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([err]);

    expect(validateStaticAccess).toBeCalledTimes(1);
    expect(validateDocument).toBeCalledTimes(0);
  });

  test("failed dynamic access", async () => {
    const err = "err";
    (validateDynamicAccess as any).mockImplementationOnce((_desc: LogicDescriptor, _doc: any) => {throw err;});
    const res = await fetchWrapper(descriptor, original, doc.ref);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([err]);

    expect(validateDynamicAccess).toBeCalledTimes(1);
    expect(trimReadFields).toBeCalledTimes(0);
  });

  test("success", async () => {
    const res = await fetchWrapper(descriptor, original, doc.ref);

    expect(res.success).toBeTruthy();
    expect(res.messages).toStrictEqual([]);

    expect(original).toBeCalledTimes(1);
    expect(trimReadFields).toBeCalledTimes(1);

  });
});



// describe("searchWrapper", () => {
//   const originalArr = jest.fn(async (args: any) => [doc]);

//   beforeEach(() => {
//     descriptor = {
//       collection: "test",
//       readFields: ["*"],
//       value: original,
//       fetch: jest.fn(async (ref: string) => doc),
//     };

//     resetMocks();
//     originalArr.mockClear();

//   });

//   test("failed login", async () => {
//     const err = "Login Error";
//     (validateLogin as any).mockImplementationOnce((_desc: any) => {throw err;});

//     const res = await searchWrapper(descriptor, originalArr, doc.ref);

//     expect(res.success).toBeFalsy();
//     expect(res.messages).toStrictEqual([err]);

//     expect(validateLogin).toBeCalledTimes(1);
//     expect(validateStaticAccess).toBeCalledTimes(0);
//   });

//   test("failed static access", async () => {
//     const err = "Static Error";
//     (validateStaticAccess as any).mockImplementationOnce((_desc: any) => {throw err;});

//     const res = await searchWrapper(descriptor, originalArr, doc.ref);

//     expect(res.success).toBeFalsy();
//     expect(res.messages).toStrictEqual([err]);

//     expect(validateStaticAccess).toBeCalledTimes(1);
//     expect(validateDocument).toBeCalledTimes(0);
//   });

//   test("failed dynamic access", async () => {
//     const err = "err";
//     (validateDynamicAccess as any).mockImplementationOnce((_desc: LogicDescriptor, _doc: any) => {throw err;});
//     const res = await searchWrapper(descriptor, originalArr, doc.ref);

//     expect(res.success).toBeTruthy();
//     expect(res.doc).toStrictEqual([]);

//     expect(validateDynamicAccess).toBeCalledTimes(1);
//     expect(originalArr).toBeCalledTimes(1);
//   });

//   test("success", async () => {
//     const res = await searchWrapper(descriptor, originalArr, doc.ref);

//     expect(res.success).toBeTruthy();
//     expect(res.doc).toStrictEqual([doc]);

//     expect(originalArr).toBeCalledTimes(1);
//     expect(trimReadFields).toBeCalledTimes(1);

//   });
// });



describe("deleteWrapper", () => {
  beforeEach(() => {
    descriptor = {
      collection: "test",
      readFields: ["*"],
      value: original,
      fetch: jest.fn(async (ref: string) => doc),
    };

    resetMocks();
  });

  test("invalid ref", async () => {
    (isValidRef as any).mockImplementationOnce((_ref: any) => {return false;});

    const res = await updateWrapper(descriptor, original, doc.ref, doc);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([`The ref '${doc.ref}' is not valid`]);

    expect(isValidRef).toBeCalledTimes(1);
    expect(isValidCollection).toBeCalledTimes(0);
  });

  test("invalid collection", async () => {
    (isValidCollection as any).mockImplementationOnce((_ref: any, _expectedCollection?: string) => {return false;});

    const res = await updateWrapper(descriptor, original, doc.ref, doc);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([`The collection within '${doc.ref}' is not valid`]);

    expect(isValidCollection).toBeCalledTimes(1);
    expect(validateLogin).toBeCalledTimes(0);
  });

  test("failed login", async () => {
    const err = "Login Error";
    (validateLogin as any).mockImplementationOnce((_desc: any) => {throw err;});

    const res = await updateWrapper(descriptor, original, doc.ref, doc);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([err]);

    expect(validateLogin).toBeCalledTimes(1);
    expect(validateStaticAccess).toBeCalledTimes(0);
  });

  test("failed static access", async () => {
    const err = "Static Error";
    (validateStaticAccess as any).mockImplementationOnce((_desc: any) => {throw err;});

    const res = await updateWrapper(descriptor, original, doc.ref, doc);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([err]);

    expect(validateStaticAccess).toBeCalledTimes(1);
    expect(validateDocument).toBeCalledTimes(0);
  });

  test("failed document access", async () => {
    const err = "Document Error";
    (validateDocument as any).mockImplementationOnce((_desc: any) => {throw [err];});

    const res = await updateWrapper(descriptor, original, doc.ref, doc);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([err]);

    expect(validateStaticAccess).toBeCalledTimes(1);
    expect(validateDocument).toBeCalledTimes(1);
    expect(original).toBeCalledTimes(0);
  });

  test("no fetch", async () => {
    descriptor.fetch = undefined;
    const res = await updateWrapper(descriptor, original, doc.ref, doc);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([`A fetch function is required for the update function`]);

    expect(validateStaticAccess).toBeCalledTimes(1);
    expect(validateDynamicAccess).toBeCalledTimes(0);
  });

  test("bad fetch", async () => {
    (descriptor.fetch as any).mockImplementationOnce((_ref: string) => undefined);
    const res = await updateWrapper(descriptor, original, doc.ref, doc);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([`A document with ref '${doc.ref}' could not be found`]);

    expect(descriptor.fetch).toBeCalledTimes(1);
    expect(validateDynamicAccess).toBeCalledTimes(0);
  });

  test("failed dynamic access", async () => {
    const err = "err";
    (validateDynamicAccess as any).mockImplementationOnce((_desc: LogicDescriptor, _doc: any) => {throw err;});
    const res = await updateWrapper(descriptor, original, doc.ref, doc);

    expect(res.success).toBeFalsy();
    expect(res.messages).toStrictEqual([err]);

    expect(validateDynamicAccess).toBeCalledTimes(1);
    expect(original).toBeCalledTimes(0);
  });

  test("success", async () => {
    const res = await updateWrapper(descriptor, original, doc.ref, doc);

    expect(res.success).toBeTruthy();
    expect(res.messages).toStrictEqual([]);

    expect(original).toBeCalledTimes(1);
    expect(trimReadFields).toBeCalledTimes(1);
  });
});

describe("verifyVersion", () => {
  test("version up to date", () => {
    return
  });

  test("version not up to date", () => {
    return
  });
});
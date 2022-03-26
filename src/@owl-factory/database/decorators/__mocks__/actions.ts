import { Descriptor } from "../types";

export const validateDynamicAccess = jest.fn((_descriptor: Descriptor, _doc: any) => {
  return;
});

export const validateStaticAccess = jest.fn((_descriptor: Descriptor) => {
  return;
});

export const validateDocument = jest.fn((_descriptor: Descriptor, _doc: any) => {
  return;
});

export const validateLogin = jest.fn((_descriptor: Descriptor) => {
  return;
});

export const trimReadFields = jest.fn((_descriptor: Descriptor, doc: any) => { return doc; });
export const trimSetFields = jest.fn((_descriptor: Descriptor, doc: any) => { return doc; });
export const setCreateFields = jest.fn((_descriptor: Descriptor, doc: any) => { return doc; });
export const setUpdateFields = jest.fn((_descriptor: Descriptor, doc: any) => { return doc; });



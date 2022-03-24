import { Ref64 } from "@owl-factory/types";

export const clear = jest.fn((_collection: string) => { return; });
export const remove = jest.fn((collection: string, _ref: Ref64) => {
  if (collection === "success") { return 1; }
  return 0;
});
export const set = jest.fn((_collection: string, _ref: Ref64) => { return; });
export const setRefs = jest.fn((_collection: string, _refs: Ref64[]) => { return; });

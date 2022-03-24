import { CollectionMap } from "../ref";

export const isEncoding = jest.fn((ref: string) => true);
export const decode = jest.fn((ref64: string, collections: CollectionMap): { id: string, collection: string} | null => {
  if (ref64 === "invalid") { return null; }
  return { id: "1234567890", collection: "testObjects" };
});

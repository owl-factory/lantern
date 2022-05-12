import { CollectionMap, decode, isEncoding } from "../../ref";

(isEncoding as any).mockImplementation((_ref: string) => true);
(decode as any).mockImplementation((ref64: string, _collections: CollectionMap): { id: string, collection: string} | null => {
  if (ref64 === "invalid") { return null; }
  return { id: "1234567890", collection: "testObjects" };
});

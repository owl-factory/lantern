import { Ref64 } from "@owl-factory/types";
import { decode as $decode, encode as $encode, CollectionMap } from "@owl-factory/utilities/ref";
import { Collection } from "fauna";


// A collection of all collections used in the database and the key used to identify the
// beginning of their encoded ref IDs
export const collections: CollectionMap = [
  { id: "A", string: "users" },
  { id: "B", string: Collection.Characters },
  { id: "C", string: "campaigns" },
  { id: "D", string: "images" },
  { id: "E", string: "rulesets" },
  { id: "G", string: "contents" },
  { id: "H", string: "content_types" },
  { id: "I", string: "scenes" },
  { id: "K", string: "files" },
  { id: "L", string: "modules" },
  { id: "J", string: Collection.ActorSheets },
];

/**
 * Decodes a ref into an ID and collection pair
 * @param ref The ref to decode into an id and collection pair
 * @returns An object with an id and collection pair
 */
export function decode(ref: Ref64): { id: string, collection: string} | null {
  return $decode(ref, collections);
}

/**
 * Encodes an ID and collection into a base64 Ref
 * @param id The raw numerical ID to convert into a base 64 ref
 * @param collection The collection to convert into a base 64 ref
 * @returns The encoded ref
 */
export function encode(id: string, collection: string): string | null {
  return $encode(id, collection, collections);
}

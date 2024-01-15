import { Result } from "types/functional";
import { Err, Ok } from "utils/functional";
import { arrayRegex } from "utils/regex";

// TODO convert file to `example.ts`, add tests in `example.spec.ts`. Take care of other TODO tasks.

/**
 * This type will be in the main model under `types`,
 * and will be used in all tables with dynamic content.
 */
export type Data = { [key: string]: string } & { name: string };

/**
 * Flattens an object of indeterminate depth into a Data object of depth-1 key-value pairs.
 * @param object - A JavaScript object of indeterminate depth. Example:
 * `{name: "Character", stats: {abilityScores: {strength: "12"}}}`.
 * @returns a flattened JavaScript object with keys that may be paths. Example:
 * `{name: "Character", "stats.abilityScores.strength": "12"}`.
 */
export function flatten(object: unknown, recursing = false): Result<Data, string> {
  // TODO make this if statement more readable or explain it well in a comment.
  if (!object || typeof object !== "object" || (!recursing && !object["name"])) {
    return Err("Failed to convert JavaScript object into Lantern data format.");
  }

  const result = {};

  for (const key in object) {
    const value = object[key];
    // We call this function recursively to check if value is an object, and process it if so.
    const temp = flatten(value, true);
    if (temp.ok) {
      for (const key2 in temp.data) {
        // Store temp data in result
        if (isPositiveInteger(key2)) {
          // For arrays
          result[key + "[" + key2 + "]"] = temp.data[key2];
        } else {
          // For objects
          result[key + "." + key2] = temp.data[key2];
        }
      }
    } else {
      // Else store object[key] in result directly
      result[key] = value;
    }
  }
  return Ok(result as Data);
}

/**
 * Expands a flat Data object of key-value pairs some keys being JavaScript accessor paths into objects of indeterminate depth.
 * @param data - Flat JavaScript object with keys that may be paths. Example:
 * `{name: "Character", "stats.abilityScores.strength": "12"}`.
 * @returns a JavaScript object that has been expanded. Example:
 * `{name: "Character", stats: {abilityScores: {strength: "12"}}}`.
 */
export function expand(data: Data): object {
  const result: object = {};
  for (const key in data) {
    const splitKeys = key.replace(arrayRegex, ".$1").split(".");
    // TODO make this code more readable or explain it well in a comment.
    splitKeys.reduce((object, splitKey, splitKeyIndex) => {
      return (
        object[splitKey] ||
        (object[splitKey] = !isPositiveInteger(splitKeys[splitKeyIndex + 1])
          ? splitKeys.length - 1 == splitKeyIndex
            ? data[key]
            : {}
          : [])
      );
    }, result);
  }
  return result;
}

/**
 * Tests if a passed value is an integer, then tests if it is positive (including 0).
 * @param input - Number or string to check. Strings are parsed to numbers before checking.
 * @returns true if input value represents a positive integer, false otherwise.
 */
export function isPositiveInteger(input: string | number): boolean {
  const num = typeof input === "number" ? input : Number(input);
  return Number.isInteger(num) && num >= 0;
}

// TODO delete test object and script
const object = {
  name: "Laura Wenning",
  pronouns: "she/her",
  stats: {
    abilityScores: {
      intelligence: 18,
      wisdom: 14,
      charisma: 10,
      strength: 12,
      constitution: 12,
      dexterity: 14,
    },
    ac: 12,
  },
  content: {
    items: ["Framework Laptop", "Note 9", "Cuteness"],
    spells: ["Fireball", "Firebolt"],
  },
};

// Run this as script with `pnpm exec tsx ./src/utils/data-example.ts`.
const res = flatten(object);
if (res.ok) {
  console.log(res.data);
  const expanded = expand(res.data);
  console.log(expanded);
}

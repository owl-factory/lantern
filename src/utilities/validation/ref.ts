import { isValidRef } from "@owl-factory/data/helpers/fields";

/**
 * Validates the ref
 * @param ref The ref to validate
 */
export function validateRef(ref: string) {
  if (!isValidRef(ref)) { throw `Ref '${ref}' is not a valid ref`; }
}

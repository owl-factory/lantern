import { isValidRef } from "utilities/fields";

/**
 * Validates the ref
 * @param ref The ref to validate
 */
export function validateRef(ref: string) {
  if (!isValidRef(ref)) { throw `Ref '${ref}' is not a valid ref`; }
}

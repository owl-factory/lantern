import { parseSCSS } from "../parse";

/**
 * Validates that the given SCSS is valid
 * @param scss The SCSS to validate
 */
export function validateSCSS(viewID: string, scss: string) {
  // There might be a better way to validate SCSS without compiling it, but this seems to be the best way for now
  try {
    const _css = parseSCSS(viewID, scss);
  } catch (e) {
    if (typeof e === "string") {
      throw { title: "SASS Parsing Error", description: e };
    }
    throw e;
  }
}

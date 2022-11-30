import { ViewType } from "nodes/view-renderer/enums/viewType";
import { parseSCSS } from "../parse";

/**
 * Validates that the given SCSS is valid
 * @param scss The SCSS to validate
 */
export async function validateSCSS(viewID: string, viewType: ViewType, scss: string) {
  // There might be a better way to validate SCSS without compiling it, but this seems to be the best way for now
  try {
    const _css = await parseSCSS(viewID, viewType, scss);
  } catch (e) {
    if (typeof e === "string") {
      throw { title: "SASS Parsing Error", description: e };
    }
    throw e;
  }
}

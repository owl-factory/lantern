import { rest } from "nodes/https";
import { ViewType } from "nodes/view-renderer/enums/viewType";

/**
 * Parses SCSS into CSS
 * @param viewID The ID of the view this SCSS will be parsed for
 * @param viewType The type of view that this SCSS will be parsed for
 * @param scss The SCSS to parse into CSS
 * @returns The parsed CSS
 */
export async function parseSCSS(viewID: string, viewType: ViewType, scss: string): Promise<string> {
  let cssResult;
  try {
    let prefix;
    switch (viewType) {
      case ViewType.ActorSheet:
        prefix = "actor-sheet";
        break;
      case ViewType.ContentResult:
        prefix = "content-result";
        break;
      case ViewType.ContentSearch:
        prefix = "content-search";
        break;
      case ViewType.ContentSheet:
        prefix = "content-sheet";
        break;
    }
    const rawStyling = `.${prefix}-${viewID} { ${scss} }`;

    cssResult = await rest.post<{ css: string }>(`/api/sass`, { sass: rawStyling });
  } catch (e) {
    throw { title: "CSS Formatting Error", description: e };
  }
  return cssResult.data.css;
}

import { Grid } from "@material-ui/core";
import React, { useContext } from "react";
import { CharacterSheetContext } from "./Context";

type columnSizing = boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;

interface Module {
  type: string;
  tab: number;

  xs?: columnSizing;
  sm?: columnSizing;
  md?: columnSizing;
  lg?: columnSizing;
}

let i: number;

/**
 * A public wrapper function that starts off a recursive function and wraps the
 * result with specific tags for rendering the character sheet.
 *
 * @param modules An array of modules to loop through and render
 * @param tab The index of the current tab
 * @param renderCustomModules A custom function for rendering the specific
 *  modules for the current character sheet
 *
 * Returns a JSX Element
 */
export function renderModules(modules: Module[], tab: number, renderCustomModules: any) {
  i = 0;
  return <div>{_renderModules(modules, tab, renderCustomModules, 0)}</div>;
}

/**
 * A recursive function for rendering an array of modules. It returns an array
 *  of JSX Elements
 * @param modules An array of modules to loop through and render
 * @param tab The index of the current tab
 * @param renderCustomModules A custom function for rendering specific modules
 *   for the current character sheet
 * @param startIndex The index that the loop starts on
 *
 * Returns an array of JSX Elements
 */
function _renderModules(modules: Module[], tab: number, renderCustomModules: any, startIndex: number) {
  const renderedModules: JSX.Element[] = [];
  const context = useContext(CharacterSheetContext);

  for (i = startIndex; i < modules.length; i++) {
    // Ignore any modules for other tabs
    if (modules[i].tab !== tab) {
      continue;
    }

    switch (modules[i].type.toLowerCase()) {
      case "row":
        i++;
        renderedModules.push(
          <Grid container spacing={3}>
            {_renderModules(modules, tab, renderCustomModules, i)}
          </Grid>,
        );
        break;

      case "col":

        let xs: columnSizing = 12;
        let sm: columnSizing = 12;
        let md: columnSizing = 12;
        let lg: columnSizing = 12;

        if (modules[i].xs !== undefined) {
          xs = modules[i].xs;
        }

        if (modules[i].sm !== undefined) {
          sm = modules[i].sm;
        } else {
          sm = xs;
        }

        if (modules[i].md !== undefined) {
          md = modules[i].md;
        } else {
          md = sm;
        }

        if (modules[i].lg !== undefined) {
          lg = modules[i].lg;
        } else {
          lg = md;
        }

        i++;

        renderedModules.push(
          <Grid item xs={xs} sm={sm} md={md} lg={lg}>
            {_renderModules(modules, tab, renderCustomModules, i)}
          </Grid>,
        );
        break;

      case "end":
        return renderedModules;

      default:
        renderedModules.push(
          <div className={context.classes.module}>
            {renderCustomModules(modules[i])}
          </div>,
        );
        break;
    }
  }

  return renderedModules;
}

import { Display } from "../../types/layouts";

/**
 * Finds the value for a given key in the dynamic or static values
 *
 * @param key The key of the value, dynamic or static, that we wish to render for
 * @param props Contains the props of either atom or molecule and the dynamic
 *  data to look through.
 */
export function findValue(
  key: string,
  props: any
) {
  // Ensures that we're fetching for an atom or a molecule to save an input
  const atom = props.atom || props.molecule;
  if (!atom) { return ""; }

  // Fetches both dynamic values and static values for readability
  const dynamicValues = atom.dynamicValues;
  const staticValues = atom.staticValues;

  // Simple base cases: takes care of static and
  if (!dynamicValues || !(key in dynamicValues)) {
    if (staticValues !== undefined && key in staticValues) {
      return staticValues[key];
    }
    return "";
  }

  // Dives through the dynamic data to find the value
  let curr = props.data;
  const keys = dynamicValues[key].split(".");
  keys.forEach((element: string) => {
    if (!curr || !(element in curr)) { return ""; }
    curr = curr[element];
  });

  if (typeof curr === "string") { return curr; }
  return "";
}

/**
 * Renders the classes that controls if and how a block of HTML renders
 * @param display The display object that instructs on if and how to render an
 *  item at different screen sizes
 */
export function renderDisplayClasses(display?: Display) {
  let classString = " ";
  if (display === undefined) { return classString; }
  if (display.xs) { classString += `d-${display.xs} `; }
  if (display.sm) { classString += `d-sm-${display.sm} `; }
  if (display.md) { classString += `d-md-${display.md} `; }
  if (display.lg) { classString += `d-lg-${display.lg} `; }
  if (display.xl) { classString += `d-xl-${display.xl} `; }
  return classString;
}

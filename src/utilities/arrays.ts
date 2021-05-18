
/**
 * Converts an array of strings into a comma-delimited list. Eg "a, b, c"
 * @param arr The array to convert to a comma-delimited list
 * TODO - move to utilities/string?
 */
export function arrayToList(arr?: string[]): string {
  let list = "";
  if (arr === undefined) { return list; }

  const lastIndex = arr.length - 1;
  arr.forEach((item: string, index: number) => {
    list += item;
    if (index !== lastIndex) { list += ", ";}
  });
  return list;
}

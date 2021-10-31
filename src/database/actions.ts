import { read, set } from "utilities/objects";

interface Descriptor {

}

export function readFields(results: any, descriptor: any) {
  if (!("readFields" in descriptor)) { return []; }
  const fields = descriptor.readFields;
  const parsedResults: any = [];
  results.forEach((result: any) => {
    const parsedResult = {};
    fields.forEach((field: string) => {
      set(parsedResult, field, read(result, field));
    });
    parsedResults.push(parsedResult);
  });
  return parsedResults;
}

/**
 * 
 * @param descriptor The descriptor
 * @returns 
 */
export function requireLogin(descriptor: any) {
  console.log(descriptor);
  if ("requireLogin" in descriptor && !descriptor.requireLogin) {
    console.log("We do not require a login!");
    return;
  }
  console.log("LOGIN!!!");
}

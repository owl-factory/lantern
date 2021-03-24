import * as src from "type-graphql";

export const dummyValue = "";
export function dummyFn() {
  return;
}
export function dummyDecorator() {
  return dummyFn;
}

let newArg: typeof src.ObjectType = dummyDecorator;


if (typeof window !== 'undefined' && window.document) {
  newArg = src.ObjectType;
}
export const ObjectType = newArg;

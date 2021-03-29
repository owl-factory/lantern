/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * This is a weird workaround for issues caused by Type-Graphql. Because
 * Type-GraphQL uses fs, it cannot run when on the client. This causes issues
 * when trying to access class definitions that use it. This file updates
 * 
 */
let test;
if (typeof(window) === "undefined") {
  test = require("type-graphql");
} else {
  test = require("node_modules/type-graphql/dist/browser-shim.js");
}

export const Field = test.Field;
export const ID = test.ID;
export const ObjectType = test.ObjectType;

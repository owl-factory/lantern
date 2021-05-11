import { FaunaRef } from "types";


function isFaunaRef(data: object) {
  if (typeof data !== "object") { return false; }
  if ("@ref" in data) { return true; }
  if ("value" in data && typeof data.value === "object" && "id" in data.value) { return true; }
  return false;
}

function parseRef(ref: any) {
  let id, collection = "";
  if ("@ref" in ref && "id" in ref["@ref"]) {
    id = ref["@ref"].id;
    collection = ref["@ref"].collection["@ref"].id;
  } else if ( "value" in ref && "id" in ref.value ) {
    id = ref.value.id;
    collection = ref.collection.id;
  }

  return { id, collection };
}

function isFaunaDate(data: object) {
  return "@ts" in data ;
}

function determineClass(ref?: FaunaRef) {
  if (!ref) { return {}; }
  // switch(ref.value.collection)
  return {};
}

function mapLayerItem(data: any) {

  if (typeof data !== "object") { return data; }
  // Date?
  if (isFaunaDate(data)) { return new Date(data["@ts"]); }
  if (Array.isArray(data)) {
    data.forEach((item: unknown, index: number) => {
      // TODO - map layer item?
      data[index] = mapLayerItem(item);
    });
    return data;
  }
  // Fauna Ref
  if (isFaunaRef(data)) {
    return parseRef(data);
  }

  // Fauna Object
  if ("ref" in data) {
    return mapFauna(data);
  }


  // Just an object layer
  return mapLayer(data, {});

}

/**
 * 
 * @param doc 
 * @param initialDoc 
 * @returns 
 */
function mapLayer(doc: any, initialDoc: any = {}) {
  const keys = Object.keys(doc);
  keys.forEach((key: string) => {
    const data = doc[key];
    initialDoc[key] = mapLayerItem(data);

  });
  return;
}

/**
 * Maps fauna into a flatter data format for easier readability and accessibility.
 * @param doc The document to map from Fauna into a flat function
 * @param format The format to return the fauna function as. Valid options are 'class' or 'struct'.
 */
export function mapFauna(doc: any, format = "struct"): Record<string, unknown> {
  let mappedDoc: any = {};
  if (format === "class") {
    mappedDoc = determineClass(doc.ref);
  }

  const ref = parseRef(doc.ref);

  // return;
  mappedDoc.id = ref.id;
  mappedDoc.collection = ref.collection;
  mappedDoc.ts = doc.ts;

  // Nab any other extra data we want
  mapLayer(doc.data, mappedDoc);
  return mappedDoc;
}

/**
 * This sin against humanity ensures that fauna responses are in a standard format no matter where they
 * are. Eg, Ref(Collection("x"), "id") is ref { "@ref": { id, ... }}
 *
 * TODO - remove this by making other code better
 *
 * @param fauna The raw fauna object
 */
export function smoothFauna(fauna: object): Record<string, unknown> {
  return JSON.parse(JSON.stringify(fauna));
}

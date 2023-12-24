import { read, set } from "utilities/objects";
import { AnyDocument } from "types/documents";

/**
 * Determines the fields accessible to the current user based on the given document and permissions
 * @param doc The document to determine access for
 * @param myUser The current user attempting to read the document
 * @param fields An array of strings or a function that returns an array of strings that determines
 * what fields a user can view
 * @returns Returns a list of all fields the current user is allowed to view
 */
 export function determineAccessibleFields(
  doc: AnyDocument,
  myUser: unknown,
  fields: string[] | ((myUser: unknown, doc?: AnyDocument) => string[])
) {
  let selectedFields = fields;
  if (!Array.isArray(selectedFields)) {
    selectedFields = (fields as (myUser: unknown, doc?: AnyDocument) => string[])(myUser, doc);
  }
  return selectedFields;
}

/**
 * Trims the given document to only have the given fields. All others are discarded.
 * @param doc The document to trim
 * @param givenAllowedFields The given fields to keep, if any
 */
 export function trimFields<T extends {}>(doc: T, fields: string[]): Partial<T> {
  // Wildcard. Allows for returning all fields without needing to specify each one
  if (fields.includes("*")) { return doc; }

  const approvedDoc: Partial<T> = {};
  fields.forEach((field: string) => {
    if (field.match(/\.\*$/g)) {
      const tempField = field.slice(0, -2);
      set(approvedDoc, tempField, read(doc as Record<string, unknown>, tempField));
      return;
    }
    set(approvedDoc, field, read(doc as Record<string, unknown>, field));
  });

  return approvedDoc;
}

/**
 * Trims the given document to only have the given fields. All others are discarded.
 * @param doc The document to trim
 * @param givenAllowedFields The given fields to keep, if any
 */
export function trimRestrictedFields(
  doc: Record<string, unknown>,
  givenAllowedFields: string[],
  includeDefault=false
): Record<string, unknown> {
  const allowedFields: string[] = [...givenAllowedFields];

  // Wildcard. Allows for returning all fields without needing to specify each one
  if (allowedFields.includes("*")) { return doc; }

  if (includeDefault) {
    allowedFields.concat([
      "id", "collection", "ref", "name", "createdAt", "updatedAt", "ownedBy", "createdBy", "updatedBy",
    ]);
  }

  const newDoc: any = {};
  allowedFields.forEach((allowedField: string) => {
    if (allowedField.match(/\.\*$/g)) { allowedField = allowedField.slice(0, -2); }
    const value = read(doc, allowedField);
    if (value === undefined) { return; }
    set(newDoc, allowedField, read(doc, allowedField));
  });

  return newDoc;
}

/**
 * Trims unapproved fields from an array of documents
 * @param docs The documents to trim fields from
 * @param myUser The current user attempting to view multiple fields
 * @param fields A list of or function returning a list of fields to determine what the current user can access
 * @returns Returns an array of documents with fields in each trimmed, if necessary
 */
 export function trimRestrictedFieldsOn(
  docs: AnyDocument[],
  myUser: unknown,
  fields: string[] | ((myUser: unknown, doc?: AnyDocument) => string[]),
  includeDefault=false
) {
  docs.forEach((doc: AnyDocument) => {
    const selectedFields = determineAccessibleFields(doc, myUser, fields);
    doc = trimRestrictedFields(
      doc as unknown as Record<string, unknown>, selectedFields, includeDefault
    ) as unknown as AnyDocument;
  });
  return docs;
}

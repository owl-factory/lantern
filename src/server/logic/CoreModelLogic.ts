import { CoreDocument } from "types";

export class CoreModelLogic {
  /**
   * Trims the given document to only have the given fields. All others are discarded.
   * @param doc The document to trim
   * @param givenAllowedFields The given fields to keep, if any
   * @returns A subset object of the given document
   */
  public static trimRestrictedFields(
    doc: any,
    givenAllowedFields: string[]
  ): any {
    const allowedFields = [
      "id", "collection", "ref", "ts", "name", "createdAt", "updatedAt", "ownedBy", "createdBy", "updatedBy",
    ].concat(givenAllowedFields);

    const newDoc: any = {};
    allowedFields.forEach((allowedField: string) => {
      if (!(allowedField in doc)) { return; }
      newDoc[allowedField] = doc[allowedField];
    });

    return newDoc;
  }
}
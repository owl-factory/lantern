export class CoreModelLogic {
  /**
   * Trims the given document to only have the given fields. All others are discarded.
   * @param doc The document to trim
   * @param givenAllowedFields The given fields to keep, if any
   * @returns A subset object of the given document
   */
  public static trimRestrictedFields(
    doc: Record<string, unknown>,
    givenAllowedFields: string[]
  ): Record<string, unknown> {
    const allowedFields = [
      "id", "collection", "ts", "name", "createdAt", "updatedAt", "ownedBy", "createdBy", "updatedBy",
    ].concat(givenAllowedFields);

    const newDoc: Record<string, unknown> = {};
    allowedFields.forEach((allowedField: string) => {
      newDoc[allowedField] = doc[allowedField];
    });

    return newDoc;
  }
}
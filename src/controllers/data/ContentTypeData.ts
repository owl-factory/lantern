import { DataManager } from "@owl-factory/data/DataManager";
import { Ref64 } from "@owl-factory/types";
import { ContentTypeDocument } from "types/documents";
import { requireLogin, requirePermission } from "utilities/validation/account";
import { validateNewContentType, validateUpdatedContentType } from "utilities/validation/contentType";
import { RulesetData } from "./RulesetData";

class ContentTypeDataManager extends DataManager<Partial<ContentTypeDocument>> {
  public collection = "content-types";

  constructor() {
    super("/api/content-types");

    // TODO - content types should be deliniated by rulesets
  }

  /**
   * Creates a single content type document
   * @param doc The document to create
   * @returns The created document
   * @throws Errors with the validation or creation
   */
  public async create(doc: Partial<ContentTypeDocument>): Promise<Partial<ContentTypeDocument>> {
    delete doc.ref;

    requireLogin();
    requirePermission("createContentType");
    validateNewContentType(doc);

    // TODO - create a side function that sets this data
    const ruleset = RulesetData.get((doc.ruleset as { ref: Ref64 }).ref);
    (doc.ruleset as any).name = ruleset?.name as string;
    if (doc.parent && doc.parent.ref !== null) {
      const parent = this.get((doc.parent as { ref: Ref64 }).ref);
      (doc.parent as any).name = parent?.name as string;
    }

    const packets = await super.$create(doc);
    if (packets.length === 0) { throw `An unexpected error occured when creating the content type ${doc.name}`; }
    else if (!packets[0].success) { throw packets[0].messages; }
    return packets[0].doc as Partial<ContentTypeDocument>;
  }

  /**
   * Updates a single content type document
   * @param doc The document to update
   * @returns The updated document
   * @throws Errors with the validation or updating
   */
  public async update(doc: Partial<ContentTypeDocument>): Promise<Partial<ContentTypeDocument>> {
    requireLogin();
    requirePermission("updateContentType");
    validateUpdatedContentType(doc);

    const packets = await super.$update(doc);
    if (packets.length === 0) { throw `An unexpected error occured when updating the content type ${doc.name}`; }
    else if (!packets[0].success) { throw packets[0].messages; }
    return packets[0].doc as Partial<ContentTypeDocument>;
  }
}

export const ContentTypeData = new ContentTypeDataManager();

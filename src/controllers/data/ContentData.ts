import { DataManager } from "@owl-factory/data/DataManager";
import { rest } from "@owl-factory/https/rest";
import { Ref64 } from "@owl-factory/types";
import { isOwner } from "security/documents";
import { ContentDocument } from "types/documents";
import { requireLogin, requirePermission } from "utilities/validation/account";
import { validateNewContent, validateUpdatedContent } from "utilities/validation/content";
import { RulesetData } from "./RulesetData";

class ContentDataManager extends DataManager<Partial<ContentDocument>> {
  public collection = "contents";

  constructor() {
    super("/api/contents");

    this.addGroup("owned-contents", isOwner);
    // TODO - content should be grouped by content type and rulesets
  }

  public async loadDocuments(refs: string[]): Promise<Partial<ContentDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ contents: Partial<ContentDocument>[] }>(`/api/contents`, { refs: refs });
    return docs.data.contents;
  }

  /**
   * Creates a single content document
   * @param doc The document to create
   * @returns The created document
   * @throws Errors with the validation or creation
   */
  public async create(doc: Partial<ContentDocument>): Promise<Partial<ContentDocument>> {
    delete doc.ref;

    requireLogin();
    requirePermission("createContent");
    validateNewContent(doc);

    // TODO - create a side function that sets this data
    const ruleset = RulesetData.get((doc.ruleset as { ref: Ref64 }).ref);
    (doc.ruleset as any).name = ruleset?.name as string;
    if (doc.contentType && doc.contentType.ref !== null) {
      const contentType = this.get((doc.contentType as { ref: Ref64 }).ref);
      (doc.contentType as any).name = contentType?.name as string;
    }

    const packets = await super.$create(doc);
    if (packets.length === 0) { throw `An unexpected error occured when creating the content ${doc.name}`; }
    else if (!packets[0].success) { throw packets[0].messages; }
    return packets[0].doc as Partial<ContentDocument>;
  }

  /**
   * Updates a single content document
   * @param doc The document to update
   * @returns The updated document
   * @throws Errors with the validation or updating
   */
  public async update(doc: Partial<ContentDocument>): Promise<Partial<ContentDocument>> {
    requireLogin();
    requirePermission("updateContent");
    validateUpdatedContent(doc);

    const packets = await super.$update(doc);
    if (packets.length === 0) { throw `An unexpected error occured when updating the content ${doc.name}`; }
    else if (!packets[0].success) { throw packets[0].messages; }
    return packets[0].doc as Partial<ContentDocument>;
  }
}

export const ContentData = new ContentDataManager();

import { RulesetDocument } from "types/documents";
import { DataManager } from "@owl-factory/data";
import { isPublic } from "server/logic/security";
import { isOwner } from "security/documents";
import { requireLogin, requirePermission } from "utilities/validation/account";
import { validateNewRuleset, validateUpdatedRuleset } from "utilities/validation/ruleset";

// Manages data for Ruleset Documents
class RulesetDataManager extends DataManager<Partial<RulesetDocument>> {
  public collection = "rulesets";

  constructor() {
    super("/api/rulesets");

    this.addGroup("owned-rulesets", isOwner);
    this.addGroup("public-rulesets", isPublic);
  }

  /**
   * Creates a single ruleset document
   * @param doc The document to create
   * @returns The created document
   * @throws Errors with the validation or creation
   */
  public async create(doc: Partial<RulesetDocument>): Promise<Partial<RulesetDocument>> {
    requireLogin();
    requirePermission("createRuleset");
    validateNewRuleset(doc);

    const packets = await super.$create(doc);
    if (packets.length === 0) { throw `An unexpected error occured when creating the document ${doc.name}`; }
    else if (!packets[0].success) { throw packets[0].messages; }
    return packets[0].doc as Partial<RulesetDocument>;
  }

  /**
   * Updates a single ruleset document
   * @param doc The document to update
   * @returns The updated document
   * @throws Errors with the validation or updating
   */
  public async update(doc: Partial<RulesetDocument>): Promise<Partial<RulesetDocument>> {
    requireLogin();
    requirePermission("updateRuleset");
    validateUpdatedRuleset(doc);

    const packets = await super.$update(doc);
    if (packets.length === 0) { throw `An unexpected error occured when updating the ruleset document ${doc.name}`; }
    else if (!packets[0].success) { throw packets[0].messages; }
    return packets[0].doc as Partial<RulesetDocument>;
  }
}

export const RulesetData = new RulesetDataManager();

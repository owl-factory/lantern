
import { Collection, FaunaIndex } from "fauna";
import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import { Ref64 } from "types";
import { CampaignDocument, RulesetDocument, UserDocument } from "types/documents";
import { MyUserDocument, UserRole } from "types/security";
import { DatabaseLogic } from "./AbstractDatabaseLogic";
import * as fauna from "database/integration/fauna";
import { Create, Fetch, FetchMany, Index, Update } from "database/decorators/crud";
import { Access, ReadFields, SetFields } from "database/decorators/modifiers";
import { FaunaIndexOptions } from "types/fauna";

const USER_VIEW_FIELDS: string[] = [
];

class $RulesetLogic implements DatabaseLogic<RulesetDocument> {
  public collection = Collection.Rulesets;

  @Create
  @Access({[UserRole.Admin]: true})
  @ReadFields(["*"])
  @SetFields(["name", "isOfficial"])
  public async createOne(doc: Partial<RulesetDocument>): Promise<RulesetDocument> {
    const ruleset = await fauna.createOne<RulesetDocument>(this.collection, doc);
    if (ruleset === undefined) {
      throw {code: 500, message: "An unexpected error occured while creating the document"};
    }
    return ruleset;
  }

  @Fetch
  @Access({[UserRole.Guest]: true})
  @ReadFields(["*"])
  public async findByID(id: Ref64): Promise<RulesetDocument> {
    const ruleset = await fauna.findByID<RulesetDocument>(id);
    if (ruleset === undefined) { throw { code: 404, message: `A ruleset with ID ${id} could not be found` }; }
    return ruleset;
  }

  @FetchMany
  @Access({[UserRole.Guest]: true})
  @ReadFields(["*"])
  public async findManyByIDs(ids: Ref64[]): Promise<RulesetDocument[]> {
    const rulesets = await fauna.findManyByIDs<RulesetDocument>(ids);
    return rulesets;
  }

  @Update
  @Access({[UserRole.Admin]: true})
  @ReadFields({[UserRole.Admin]: ["*"]})
  @SetFields({[UserRole.Admin]: ["isPublic"]})
  public async updateIsPublic(id: Ref64, doc: Partial<RulesetDocument>): Promise<RulesetDocument> {
    const ruleset = await fauna.updateOne(id, doc);
    if (ruleset === undefined) {
      throw {code: 500, message: "An unexpected error occured while updating the document"};
    }
    return ruleset;
  }

  @Index
  @Access({[UserRole.Guest]: true})
  @ReadFields(["*"])
  public async searchRulesetsByOfficial(isOfficial: boolean, options?: FaunaIndexOptions) {
    const rulesets = fauna.searchByIndex(FaunaIndex.RulesetsByOfficial, [isOfficial], options);
    return rulesets;
  }

}

export const RulesetLogic = new $RulesetLogic();

const RulesetLogicBuilder = new FaunaLogicBuilder("rulesets")
  // Globals
  // Users are only able to view campaigns if they are a player, and all fields if they are an owner/GM
  .fields()
    .guest(["*"])
  .done()
  .roles()
    .guest(true)
  .done()

  /**
   * Initializes the fetch function from defaults
   */
  .fetch()
  .done()

  /**
   * Creates a function for fetching many campaign documents at once. It should use the same
   * logic and security as the ordinary fetch fucntion
   */
  .fetchMany()
  .done()

  .create()
    .roles()
      .guest(false)
      .user(false)
      .moderator(false)
      .admin(true)
    .done()
    .setFields()
      .admin(["name", "isOfficial"])
    .done()
  .done()

  .update("setPublic")
    .roles()
      .guest(false)
      .user(false)
      .moderator(false)
      .admin(true)
    .done()
    .setFields()
      .guest([])
      .admin(["isPublic"])
    .done()
  .done()

  .update("lockRuleset")

  .done()

  .search("fetchOfficialRulesets", "rulesets_by_official")
    .indexFields(["updatedAt", "ref", "name", "ownedBy", "isPublic", "isLocked"])
  .done()


.done();
// export const RulesetLogic = RulesetLogicBuilder.export();

/**
 * Determines if a standard user is able to view any part of a document
 * @param myUser The current user attempting to view
 * @param doc The document the user is attempting to view
 * @returns True if the user may view any part of the document, false otherwise
 */
function userViewable(myUser: MyUserDocument, doc?: CampaignDocument): boolean {
  if (!doc) { return false; }
  if (doc.ownedBy?.id === myUser.id) { return true; }
  doc.players?.forEach((player: UserDocument) => {
    if (player.id === myUser.id) { return true; }
  });

  return false;
}

/**
 * Determines which fields a user has access to in a given document
 * @param myUser The user attempting to view the document
 * @param doc The document the user is attempting to view
 * @returns An array of strings indicating what fields the user is able to see. *s indicate any field at that level
 */
function userViewableFields(myUser: MyUserDocument, doc?: CampaignDocument): string[] {
  if (!doc) { return []; }

  // Is owner check
  if (doc.ownedBy?.id === myUser.id) { return ["*"]; }

  // If a player, return the user view fields
  doc.players?.forEach((player: UserDocument) => {
    if (player.id === myUser.id) { return USER_VIEW_FIELDS; }
  });

  // Edge case
  // TODO - can campaigns be public? Or should pre-generated campaigns be their own document type?
  return [];
}

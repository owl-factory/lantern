import { FaunaLogicBuilder } from "server/faunaLogicBuilder/FaunaLogicBuilder";
import { AnyDocument, CharacterDocument } from "types/documents";
import { MyUserDocument } from "types/security";
import { myUserToTerm } from "./CoreModelLogic";
import { isOwner_old } from "./security";

const USER_VIEW_FIELDS = [];

const CharacterLogicBuilder = new FaunaLogicBuilder("characters")
  .fields()
    .guest([])
    .user(userViewableFields)
    .admin(["*"])
  .done()
  .roles()
    .guest(false)
    .user(userViewable)
    .admin(true)
  .done()

  /**
   * Initializes the fetch function from defaults
   */
  .fetch()
  .done()

  .fetchMany()
  .done()

  /**
   * Allows for searching through all of a user's campaigns from last played to oldest played
   * The index fields allow for base data to populate tiles
   */
   .search("fetchMyCharacters", "my_characters_asc")
    .preProcessTerms(myUserToTerm)
    .indexFields(["updatedAt", "ref", "name", "ruleset.ref", "campaign.ref", "profile.src"])
    // Explicitly allow the user since the index guarantees ownership/playing
    .roles()
      .user(true)
    .done()
  .done()
.done();

function userViewableFields(myUser: MyUserDocument, doc?: AnyDocument) {
  if (isOwner_old(myUser, doc)) { return ["*"]; }
  return [];
}

function userViewable(myUser: MyUserDocument, doc?: AnyDocument) {
  if (isOwner_old(myUser, doc)) { return true; }
  return false;
}

export const CharacterLogic = CharacterLogicBuilder.export();

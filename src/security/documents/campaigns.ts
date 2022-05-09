import { Ref64 } from "@owl-factory/types";
import { Auth } from "controllers/auth";
import { AnyDocument, CampaignDocument } from "types/documents";
import { isOwner } from ".";

/**
 * Checks if the current user is a player for the given document
 * @param doc The document to if the current user is a player of
 * @returns True if the current user is a player
 */
export function isPlayer(doc?: AnyDocument): boolean {
  if (doc === undefined) { return false; }
  if (isOwner(doc)) { return true; }
  if (!("players" in doc) || doc.players === undefined) { return false; }

  let success = false;
  doc.players.forEach((player: { ref: Ref64 }) => {
    if (Auth.user?.ref === player.ref) { success = true; }
  });

  return success;
}

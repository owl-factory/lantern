import { getServerClient } from "utilities/db";
import { Expr, query as q } from "faunadb";
import { fromFauna } from "utilities/fauna";
import { CampaignDocument, ImageDocument, UserDocument } from "types/documents";
import { CoreModelLogic, ImageLogic } from "server/logic";
import { DocumentReference, MyUserDocument, PaginationOptions } from "./CoreModelLogic";
import { isAdmin, isOwner } from "./security";

// The different levels of access for a campaign
enum CampaignAccessLevels {
  GUEST,
  PLAYER,
  OWNER,
  ADMIN,
}

const allowedPlayerFields = [
  "lastPlayed",
  "players",
  "banner",
];

const allowedGuestFields: string[] = [];

/**
 * Fetches a campaign by the id and validates against the user's id
 * @param id The id of the campaign to fetch
 * @param myID The current user's ID
 * @param roles The roles of the user, if any
 * @TODO - change to fetchCampaignByRef. ByID becomes a wrapper to build
 */
export async function fetchCampaign(
  ref: DocumentReference,
  myUser: MyUserDocument
): Promise<CampaignDocument | null> {
  let campaign = await CoreModelLogic.fetchByRef(ref);
  if (!campaign) { return null; }

  const accessLevel = determineAccessLevel(campaign, myUser);
  campaign = trimRestrictedFields(campaign, accessLevel);

  return campaign;
}

/**
 * Fetches a number of campaigns that the current user is a part of
 * @param myID The current user's ID
 * @param roles The current user's roles
 */
export async function fetchMyCampaigns(
  myUser: MyUserDocument,
  options: PaginationOptions
): Promise<CampaignDocument[]> {
  const campaigns = await CoreModelLogic.fetchByIndex(
    "my_campaigns4",
    [myUser.ref as Expr],
    ["lastPlayedAt", "ref", "name", "banner.src"],
    options
  );
  console.log(campaigns)
  return campaigns;
}

/**
 * Determines which access level the current user has access to
 * @param campaign The campaign we are determining access level of
 * @param myID The owner ID
 * @param roles The roles of the user, if any
 */
function determineAccessLevel(campaign: CampaignDocument, myUser: MyUserDocument): CampaignAccessLevels {
  if ("ADMIN" in myUser.roles) { return CampaignAccessLevels.ADMIN; }

  if (campaign.ownedBy && campaign.ownedBy.id === myUser.id) { return CampaignAccessLevels.OWNER; }

  if (!campaign.players || campaign.players.length === 0) { return CampaignAccessLevels.GUEST; }

  campaign.players.forEach((player: UserDocument) => {
    if (player.id === myUser.id) { return CampaignAccessLevels.PLAYER; }
  });

  return CampaignAccessLevels.GUEST;
}

/**
 * Determines which fields should be kept when trimming restricted fields
 * @param campaign The campaign object to trim
 * @param accessLevel The level to trim for
 */
export function trimRestrictedFields(campaign: CampaignDocument, accessLevel: CampaignAccessLevels): CampaignDocument {
  if (accessLevel === CampaignAccessLevels.ADMIN || accessLevel === CampaignAccessLevels.OWNER) {
    return campaign;
  } else if (accessLevel === CampaignAccessLevels.PLAYER) {
    return CoreModelLogic.trimRestrictedFields(campaign as Record<string, unknown>, allowedPlayerFields);
  }
  return CoreModelLogic.trimRestrictedFields(campaign as Record<string, unknown>, allowedGuestFields);
}

/**
 * Checks if the user is able to update the non-game related portions of the campaign
 * @param campaign 
 * @param myUser 
 */
function canUpdate(campaign: CampaignDocument, myUser: MyUserDocument) {
  if (isAdmin(myUser)) { return true; }
  if (isOwner(campaign, myUser)) { return true; } 
  return false;
}

export async function updateBanner(campaign: CampaignDocument, body: any, myUser: MyUserDocument) {
  if (!canUpdate(campaign, myUser)) {
    throw { code: 403, message: "You do not have permission to update this campaign's banner image." };
  }

  const image = await ImageLogic.fetchImageToSet(body.image, body.method, myUser);

  const targetCampaign = { ref: campaign.ref, banner: { ref: image.ref, src: image.src }};
  const updatedCampaign = await CoreModelLogic.updateOne(targetCampaign, ["banner"], myUser, () => true);
  return { campaign: updatedCampaign, image };
}

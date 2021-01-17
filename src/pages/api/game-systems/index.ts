import { NextApiRequest, NextApiResponse } from "next";
import { GameSystem, GameSystemModel, Organization } from "../../../types/documents";
import { databaseSetup } from "../../../utilities/mongo";

/**
 * 
 * @param userID The user ID that is attempting to access game systems
 * @param organizationIDs An array of organizations that this user belongs to
 */
export async function myGameSystems(userID: string, organizationIDs: string[]) {
  const gameSystems = await GameSystemModel.find({ ownerID: userID }).exec();
  return gameSystems;
}

export function myOrganizations(userID: string) {
  return [];
}

export default async function gameSystem(req: NextApiRequest, res: NextApiResponse) {
  try {
    databaseSetup();
    const organizations: Organization[] = myOrganizations("");
    const organizationIDs: string[] = [];
    const gameSystems: GameSystem[] = await myGameSystems("1", organizationIDs);
    res.status(200).json({
      gameSystems, 
      organizations 
    });
  } catch (e) {
    res.status(500).json(e)
  }
}
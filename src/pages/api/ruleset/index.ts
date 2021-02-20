import { NextApiRequest, NextApiResponse } from "next";
import { Ruleset, RulesetModel, Organization } from "../../../types/documents";
import { databaseSetup } from "../../../utilities/mongo";

/**
 * 
 * @param userID The user ID that is attempting to access game systems
 * @param organizationIDs An array of organizations that this user belongs to
 */
export async function myRulesets(userID: string, organizationIDs: string[]) {
  const rulesets = await RulesetModel.find({ ownerID: userID }).exec();
  return rulesets;
}

export function myOrganizations(userID: string) {
  return [];
}

export default async function ruleset(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    databaseSetup();
    const organizations: Organization[] = myOrganizations("");
    const organizationIDs: string[] = [];
    const rulesets: Ruleset[] = await myRulesets("1", organizationIDs);
    res.status(200).json({
      rulesets,
      organizations,
    });
  } catch (e) {
    res.status(500).json(e);
  }
}

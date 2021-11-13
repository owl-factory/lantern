import { isOwner } from "server/logic/security";
import { CampaignDocument } from "types/documents";
import { UserRole } from "types/security";
import { Fetch, Index } from "../decorators/crud";
import { Access, ReadFields, RequireLogin } from "../decorators/modifiers";
import { Ref64 } from "types";
import * as fauna from "../integration/fauna";

class $CampaignLogic {
  /**
   * Fetches one campaign from its ID
   * @param id The Ref64 ID of the document to fetch
   * @returns The campaign document
   */
  @Fetch
  @Access({[UserRole.User]: true, [UserRole.Admin]: true})
  @RequireLogin()
  @ReadFields(["*"])
  public async findByID(id: Ref64): Promise<CampaignDocument> {
    const campaign = await fauna.findByID<CampaignDocument>(id);
    if (campaign === undefined) { throw { code: 404, message: `A campaign with ID ${id} could not be found` }; }
    return campaign;
  }
}

export const CampaignLogic = new $CampaignLogic();

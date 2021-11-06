import { isOwner } from "server/logic/security";
import { Index } from "../decorators/crud";
import { Access, RequireLogin } from "../decorators/modifiers";

class $CampaignLogic{

  @Index
  @Access({ user: isOwner, admin: true })
  // @ReadFields(["name"])
  public search() {
    console.log("Index run");
    return;
  }

  public findByID(id: string) {
    return;
  }
}

export const CampaignLogic = new $CampaignLogic();

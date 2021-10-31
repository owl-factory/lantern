import { Index, RequireLogin } from "../decorators";

class CampaignLogic{

  @Index
  @RequireLogin(false)
  // @Roles({ user: isOwner, admin: true })
  // @ReadFields(["name"])
  public indexSearch() {
    console.log("Index run");
    console.log(this);
    return;
  }
}
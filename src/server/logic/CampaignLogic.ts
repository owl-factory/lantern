import { CoreLogicBuilder } from "server/builder/CoreBuilder";

export const CampaignLogic = (new CoreLogicBuilder("campaigns")
  .fields()
    .guest(["id", "ruleset", "players"])
  .done()
  .roles().guest(true).done()
  .fetch()
    .login(false)
  .done()
.done());

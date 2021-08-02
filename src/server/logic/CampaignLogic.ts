import { CoreLogicBuilder } from "server/builder/CoreBuilder";

export const CampaignLogic = (new CoreLogicBuilder("campaigns")
  .fetch()
    .login(false)
    .fields()
      .guest(["id", "ruleset", "players"])
    .done()
    .roles()
      .guest(true)
    .done()
  .done()
.done());

import { SecurityController } from "controllers/security";
import { NextApiRequest } from "next";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";
import { CampaignLogic } from "src/database/logic/CampaignLogic";
import { decode, encode } from "utilities/encoding";
import { read, set } from "utilities/objects";

const DEFAULT_READ_FIELDS = ["id"];

function indexWrapper(this: any) {
  console.log(this);
}

function Test2(target: any, name: string, descriptor: any) {
  console.log("run test2");
  console.log(descriptor);
  descriptor.boop = "boop!";
}

/**
 * Updates a single user
 * @param this The Handler class calling this function
 * @param req The request to the servert
 */
async function test(this: HTTPHandler, req: NextApiRequest) {
  const campaign = await CampaignLogic.findByID(encode("295957071440904710", "campaigns"));
  this.returnSuccess({campaign: campaign});
}

export default createEndpoint({
  GET: test,
});

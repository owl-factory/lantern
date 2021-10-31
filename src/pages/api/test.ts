import { NextApiRequest } from "next";
import { CampaignLogic } from "server/logic";
import { isOwner } from "server/logic/security";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";
import { RequireLogin } from "src/database/decorators";
import { read, set } from "utilities/objects";

const DEFAULT_READ_FIELDS = ["id"];

function $Roles(_target: any, _name: string, descriptor: any, required: boolean, roles: any) {
  const keys = ["guest", "user", "moderator", "admin"];
  // const 
  // keys.forEach((key: string) => {
    
  // });
}

// function Roles(roles: any) {
//   return (target: any, name: string, descriptor: any) => $Roles(target, name, descriptor, roles);
// }




function indexWrapper(this: any) {
  console.log(this);
}

function Test2(target: any, name: string, descriptor: any) {
  console.log("run test2");
  console.log(descriptor);
  descriptor.boop = "boop!"

}



/**
 * Updates a single user
 * @param this The Handler class calling this function
 * @param req The request to the servert
 */
async function test(this: HTTPHandler, req: NextApiRequest) {
  const thing = new CampaignLogic();
  thing.indexSearch();
  this.returnSuccess({ hi: "" });
}

export default createEndpoint({
  GET: test,
});
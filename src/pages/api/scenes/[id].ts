import { NextApiRequest } from "next";
import { getMyUser, requireLogin } from "server/auth";
import { ImageLogic } from "server/logic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function updateScene(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  requireLogin(myUser);
  const scene = await SceneLogic.fetchScene(req.query.id, myUser);
  if (!scene) {
    this.returnError(404, `A scene with id '${req.query}' cannot be found.`);
    return;
  }

  if (!SceneLogic.canUpdate(scene, myUser)) { 
    this.returnError(401, `You do not have permission to update ${scene.name}.`);
    return;
  }

  // TODO - add handling for forcing a save!
  const result = await SceneLogic.updateScene(scene, req.body.scene, myUser);
  this.returnSuccess({ scene: result });
}

/**
 * Creates a single new image.
 * @param this The Handler class calling this function
 * @param req The request to the server. In body, contains an image object and method. 
 */
async function createImage(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  requireLogin(myUser);
  const image = await ImageLogic.createImageFromMethod(req.body.image, req.body.method, myUser);
  this.returnSuccess({ image })
}

export default createEndpoint({GET: getImages, PUT: createImage});

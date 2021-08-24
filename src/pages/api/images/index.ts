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
async function getImages(this: HTTPHandler, req: NextApiRequest) {
  const myUser = getMyUser(req);
  requireLogin(myUser);
  const images = await ImageLogic.fetchMyImages([myUser.ref], { size: 100 }, myUser);
  this.returnSuccess({ images });
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
  this.returnSuccess({ image });
}

export default createEndpoint({GET: getImages, PUT: createImage});

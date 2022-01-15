import { NextApiRequest } from "next";
import { ImageLogic } from "server/logic/ImageLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getMyImages(this: HTTPHandler, req: NextApiRequest) {
  const images = await ImageLogic.searchMyImages({ size: 100 });
  this.returnSuccess({ images });
}

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getImages(this: HTTPHandler, req: NextApiRequest) {
  const images = await ImageLogic.findManyByIDs(req.body.refs);
  this.returnSuccess({ docs: images });
}

/**
 * Creates a single new image.
 * @param this The Handler class calling this function
 * @param req The request to the server. In body, contains an image object and method.
 */
async function createImage(this: HTTPHandler, req: NextApiRequest) {
  const image = await ImageLogic.create(req.body.method, req.body.image);
  this.returnSuccess({ image });
}

export default createEndpoint({GET: getMyImages, POST: getImages, PUT: createImage});

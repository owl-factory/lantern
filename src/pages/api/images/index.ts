import "reflect-metadata";
import { NextApiRequest } from "next";
import { ImageLogic } from "server/logic/ImageLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { fetchMany } from "server/logic/many";

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
  const images = await fetchMany(ImageLogic.fetch, req.body.refs);
  this.returnSuccess({ docs: images });
}


export default createEndpoint({ GET: getMyImages, POST: getImages });

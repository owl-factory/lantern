import "reflect-metadata";
import { NextApiRequest } from "next";
import { ImageLogic } from "server/logic/ImageLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getLibraryPage(this: HTTPHandler, _req: NextApiRequest) {
  const images = await ImageLogic.searchMyImages({ size: 100 });
  this.returnSuccess({ images });
}

export default createEndpoint({GET: getLibraryPage});

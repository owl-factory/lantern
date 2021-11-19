import { NextApiRequest } from "next";
import { ImageLogic } from "server/logic/ImageLogic";
import { HTTPHandler } from "server/response";
import { createEndpoint } from "server/utilities";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getLibraryPage(this: HTTPHandler, _req: NextApiRequest) {
  const images = await ImageLogic.searchMyImages({ size: 100 });
  console.log(images)
  this.returnSuccess({ images });
}

export default createEndpoint({GET: getLibraryPage});

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { NextApiRequest } from "next";


async function beginUpload(this: HTTPHandler, req: NextApiRequest) {
  console.log("Beginning upload!");
  console.log(req);

  this.returnSuccess({ uploadURL: "" });
}

export default createEndpoint({PUT: beginUpload});

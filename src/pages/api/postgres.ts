import { convertFrom  } from "@owl-factory/database/conversion/postgres/from";
import { query } from "@owl-factory/database/integration/postgres";
import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { NextApiRequest } from "next";
import "reflect-metadata";
import { ActorConversionMap } from "types/documents/Actor";


/**
 * Creates one or more characters
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function test(this: HTTPHandler, req: NextApiRequest) {
  const queryRes = await query("SELECT * FROM public.actors");
  const convertedRes = convertFrom(queryRes[0], ActorConversionMap);
  this.returnSuccess({ success: convertedRes });
}


export default createEndpoint({
  GET: test,
});

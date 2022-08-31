import { toInsert } from "@owl-factory/database/conversion/postgres/to";
import { query } from "@owl-factory/database/utilities/integration/postgres";
import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { NextApiRequest } from "next";
import "reflect-metadata";
import { ActorConversionMap } from "types/documents/Actor";


/**
 * Creates one or more characters
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function createActor(this: HTTPHandler, req: NextApiRequest) {
  // Validate
  // Convert to query
  const insertStatement = toInsert(req.body.actor, ActorConversionMap);
  const params = insertStatement.params;
  try {
    const queryStr = `
      INSERT INTO public.actors
      ${insertStatement}
    `;

    const queryRes = await query(queryStr, params);
    this.returnSuccess({ actor: queryRes });
  } catch (e) {
    this.returnError(500, e as string);
    return;
  }
}


export default createEndpoint({
  PUT: createActor,
});

import { toSet } from "@owl-factory/database/conversion/postgres/to";
import { query } from "@owl-factory/database/utilities/integration/postgres";
import { createEndpoint, HTTPHandler } from "@owl-factory/https/backend";
import { NextApiRequest } from "next";
import "reflect-metadata";
import { DataType } from "ts-postgres";
import { ActorConversionMap } from "types/documents/Actor";


/**
 * Creates one or more characters
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getActor(this: HTTPHandler, req: NextApiRequest) {
  try {
    const queryRes = await query(
      "SELECT * FROM public.actors as actors WHERE actors.id = $1",
      [{ value: req.query.ref as string, dataType: DataType.Uuid }]
    );
    if (queryRes.length === 0) {
      this.returnError(404, "The character could not be found");
      return;
    }
    this.returnSuccess({ success: queryRes[0] });
  } catch (e) {
    throw { code: 501, message: e};
  }
}

/**
 * Updates one character
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function updateActor(this: HTTPHandler, req: NextApiRequest) {
  const setStatement = toSet(req.body.actor, ActorConversionMap);
  const params = setStatement.params;
  let i = params.length + 1;
  const queryStr = `
    UPDATE public.actors
    ${setStatement.queryStr}
    WHERE id = $${i++}
  `;
  params.push({ value: req.query.ref as string, dataType: DataType.Uuid });
  const queryRes = await query(queryStr, params);
  this.returnSuccess({actor: queryRes});
}

/**
 * Delete one character
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
 async function deleteActor(this: HTTPHandler, req: NextApiRequest) {
  const setStatement = toSet({ deleted_at: new Date() }, ActorConversionMap);
  const params = setStatement.params;
  let i = params.length + 1;

  const queryStr = `
    UPDATE public.actors
    ${setStatement.queryStr}
    WHERE id = $${i++}
  `;
  params.push({ value: req.query.ref as string, dataType: DataType.Uuid });

  const queryRes = await query(queryStr, params);
  this.returnSuccess({actor: queryRes});
}


export default createEndpoint({
  GET: getActor,
  PATCH: updateActor,
  DELETE: deleteActor,
});

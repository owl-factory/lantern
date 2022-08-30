import "reflect-metadata";
import { NextApiRequest } from "next";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { Auth } from "controllers/auth";
import { query } from "@owl-factory/database/integration/postgres";

/**
 * Gets a list of a user's characters
 */
async function getMyCharacters(this: HTTPHandler, req: NextApiRequest) {
  if (!Auth.isLoggedIn) {
    this.returnError(403, "You must be logged in to access this resource");
    return;
  }
  try {
    const actors = await query(`
      SELECT 
        actors.id,
        actors.name,
        actors.ruleset_id,
        actors.campaign_id,
        actors.actor_sheet_id
      FROM public.actors
    `);
    console.log(actors);
    this.returnSuccess({ actors });
  } catch (e) {
    this.returnError(500, e as string);
  }
}

export default createEndpoint({ GET: getMyCharacters, POST: getMyCharacters });


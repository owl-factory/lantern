import { authenticateSession } from "lib/authentication";
import { database } from "lib/database";
import type { SelectContent } from "types/database";
import type { SelectFields } from "types/graphql";
import { Err, Ok } from "utils/results";

export async function getContent(
  id: string,
  fields: SelectFields<"content">
): Promise<Result<SelectContent>> {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth;
  }

  const sessionUser = auth.data.user;
  let dbContent: SelectContent | undefined;

  try {
    dbContent = await database
      .selectFrom("content")
      .where((eb) =>
        eb.and([
          eb("id", "=", id),
          eb.or([eb("visibility", "=", "public"), eb("ownerUserId", "=", sessionUser.userId)]),
        ])
      )
      .select(fields)
      .executeTakeFirst();
  } catch (_error) {
    dbContent = undefined;
  }
  if (dbContent === undefined) {
    return Err(
      `Failed to fetch content item with ID "${id}" from the database. It either does not exist or you lack permissions to access it.`
    );
  }
  return Ok(dbContent);
}

export async function getAllContent(
  fields: SelectFields<"content">
): Promise<Result<SelectContent[]>> {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth;
  }

  const sessionUser = auth.data.user;
  let dbContent: SelectContent[] | undefined;

  try {
    dbContent = await database
      .selectFrom("content")
      .where((eb) =>
        eb.or([eb("visibility", "=", "public"), eb("ownerUserId", "=", sessionUser.userId)])
      )
      .select(fields)
      .execute();
  } catch (_error) {
    dbContent = undefined;
  }
  if (dbContent === undefined || dbContent.length === 0) {
    return Err(`Failed to fetch one or more content items you have access to from the database.`);
  }
  return Ok(dbContent);
}

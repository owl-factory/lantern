import { authenticateSession } from "lib/authentication";
import { database } from "lib/database";
import type { ContentUpdate, NewContent, SelectContent } from "types/database";
import type { SelectFields } from "types/graphql";
import { UpdateTimestamp } from "utils/database";
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
  let dbContent;

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

export async function getContentSet(
  fields: SelectFields<"content">,
  contentTypeId?: string
): Promise<Result<SelectContent[]>> {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth;
  }

  const sessionUser = auth.data.user;
  let dbContent;

  try {
    let query = database.selectFrom("content");

    if (contentTypeId) {
      query = query.where("contentTypeId", "=", contentTypeId);
    }

    dbContent = await query
      .where((eb) =>
        eb.or([eb("visibility", "=", "public"), eb("ownerUserId", "=", sessionUser.userId)])
      )
      .select(fields)
      .execute();
  } catch (_error) {
    dbContent = undefined;
  }
  if (dbContent === undefined || dbContent.length === 0) {
    return Err("Failed to fetch one or more content items you have access to from the database.");
  }
  return Ok(dbContent);
}

export async function createContent(
  content: PartialSome<NewContent, "ownerUserId">,
  fields: SelectFields<"content">
): Promise<Result<SelectContent>> {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth;
  }

  const sessionUser = auth.data.user;
  const newContent: NewContent = { ...content, ownerUserId: sessionUser.userId };
  let newDbContent;

  try {
    newDbContent = await database
      .insertInto("content")
      .values(newContent)
      .returning(fields)
      .executeTakeFirst();
  } catch (_error) {
    newDbContent = undefined;
  }
  if (newDbContent === undefined) {
    return Err("Failed to create new item in the database.");
  }
  return Ok(newDbContent);
}

export async function updateContent(
  id: string,
  content: PartialSome<ContentUpdate, "ownerUserId">,
  fields: SelectFields<"content">
): Promise<Result<SelectContent>> {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth;
  }
  if (content.id !== null && content.id !== undefined && content.id !== id) {
    return Err(
      `Content update object contains an ID that does not match the ID of the content to be updated.`
    );
  }

  const sessionUser = auth.data.user;
  let updatedDbContent;

  try {
    updatedDbContent = await database
      .updateTable("content")
      .where((eb) => eb.and([eb("id", "=", id), eb("ownerUserId", "=", sessionUser.userId)]))
      .set(UpdateTimestamp(content))
      .returning(fields)
      .executeTakeFirst();
  } catch (_error) {
    updatedDbContent = undefined;
  }
  if (updatedDbContent === undefined) {
    return Err(
      `Failed to update content item with ID "${content.id}" from the database. It either does not exist or you lack permission to delete it.`
    );
  }
  return Ok(updatedDbContent);
}

export async function deleteContent(id: string): Promise<Result<string>> {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return auth;
  }

  const sessionUser = auth.data.user;
  let deleted;

  try {
    deleted = await database
      .deleteFrom("content")
      .where((eb) => eb.and([eb("id", "=", id), eb("ownerUserId", "=", sessionUser.userId)]))
      .returning("id")
      .executeTakeFirst();
  } catch (_error) {
    deleted = undefined;
  }
  if (deleted === undefined) {
    return Err(
      `Failed to delete content item with ID "${id}" from the database. It either does not exist or you lack permission to delete it.`
    );
  }
  return Ok(deleted.id);
}

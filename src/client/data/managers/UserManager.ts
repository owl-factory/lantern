import { UserDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const UserManager = new DataManager<UserDocument>(
  "user",
  {
    fetchMany,
  }
);

interface FetchManyResult {
  users: UserDocument[];
}

/**
 * Fetches one or many rulesets from the database
 * @param ids The ids of documents to fetch
 * @returns A collection of ruleset documents
 */
async function fetchMany(ids: string[]): Promise<UserDocument[]> {
  const result = await rest.post<FetchManyResult>(`/api/users`, { ids: ids });
  if (!result.success) { return []; }
  return result.data.users;
}

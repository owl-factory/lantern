import { CharacterDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const CharacterManager = new DataManager<CharacterDocument>(
  "character",
  {
    fetchMany,
  }
);

interface FetchManyResult {
  characters: CharacterDocument[];
}

/**
 * Fetches one or many campaigns from the database
 * @param ids The ids of documents to fetch
 * @returns A collection of campaign documents
 */
async function fetchMany(ids: string[]): Promise<CharacterDocument[]> {
  const result = await rest.post<FetchManyResult>(`/api/characters`, { ids: ids });
  if (!result.success) { return []; }
  return result.data.characters;
}


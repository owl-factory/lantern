import { ContentTypeDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const ContentManager = new DataManager<ContentTypeDocument>(
  "contentType",
  {
    fetchMany,
  }
);

interface FetchManyResult {
  contentTypes: ContentTypeDocument[];
}

/**
 * Fetches one or many content types from the database
 * @param ids The ids of documents to fetch
 * @returns A collection of content type documents
 */
async function fetchMany(ids: string[]): Promise<ContentTypeDocument[]> {
  const result = await rest.post<FetchManyResult>(`/api/content-types`, { ids: ids });
  if (!result.success) { return []; }
  return result.data.contentTypes;
}

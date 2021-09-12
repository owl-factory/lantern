import { ContentDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const ContentManager = new DataManager<ContentDocument>(
  "my-content",
  {
    fetchMany,
  }
);

interface FetchResult {
  content: ContentDocument;
}

interface FetchManyResult {
  contents: ContentDocument[];
}

/**
 * Fetches one or many content items from the database
 * @param ids The ids of documents to fetch
 * @returns A collection of content documents
 */
async function fetchMany(ids: string[]): Promise<ContentDocument[]> {
  const result = await rest.post<FetchManyResult>(`/api/content`, { ids: ids });
  if (!result.success) { return []; }
  return result.data.contents;
}

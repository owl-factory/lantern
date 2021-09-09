import { ContentDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const ContentManager = new DataManager<ContentDocument>(
  "my-content",
  {
    fetch,
    fetchMany,
  }
);

interface FetchResult {
  content: ContentDocument;
}

interface FetchManyResult {
  contents: ContentDocument[];
}

async function fetch(id: string): Promise<ContentDocument | undefined> {
  const result = await fetchMany([id]);
  if (result.length === 0) { return undefined; }
  return result[0];
}

async function fetchMany(ids: string[]): Promise<ContentDocument[]> {
  const result = await rest.post<FetchManyResult>(`/api/content`, { ids: ids });
  if (!result.success) { return []; }
  return result.data.contents;
}

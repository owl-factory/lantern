import { ContentTypeDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const ContentManager = new DataManager<ContentTypeDocument>(
  "contentType",
  {
    fetch,
    fetchMany,
  }
);

interface FetchResult {
  content: ContentTypeDocument;
}

interface FetchManyResult {
  contents: ContentTypeDocument[];
}

async function fetch(id: string): Promise<ContentTypeDocument | undefined> {
  const result = await fetchMany([id]);
  if (result.length === 0) { return undefined; }
  return result[0];
}

async function fetchMany(ids: string[]): Promise<ContentTypeDocument[]> {
  const result = await rest.post<FetchManyResult>(`/api/content-types`, { ids: ids });
  if (!result.success) { return []; }
  return result.data.contents;
}

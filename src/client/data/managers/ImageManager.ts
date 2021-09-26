import { ImageDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const ImageManager = new DataManager<ImageDocument>(
  "image",
  {
    fetchMany,
  }
);

interface FetchManyResult {
  images: ImageDocument[];
}

/**
 * Fetches one or many content types from the database
 * @param ids The ids of documents to fetch
 * @returns A collection of content type documents
 */
async function fetchMany(ids: string[]): Promise<ImageDocument[]> {
  const result = await rest.post<FetchManyResult>(`/api/images`, { ids: ids });
  if (!result.success) { return []; }
  return result.data.images;
}

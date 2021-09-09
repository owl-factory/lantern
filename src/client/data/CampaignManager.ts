import { CampaignDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const CampaignManager = new DataManager<CampaignDocument>(
  "campaign",
  {
    fetchMany,
  }
);


interface FetchManyResult {
  campaigns: CampaignDocument[];
}

/**
 * Fetches one or many campaigns from the database
 * @param ids The ids of documents to fetch
 * @returns A collection of campaign documents
 */
async function fetchMany(ids: string[]): Promise<CampaignDocument[]> {
  const result = await rest.post<FetchManyResult>(`/api/campaigns`, { ids: ids });
  if (!result.success) { return []; }
  return result.data.campaigns;
}

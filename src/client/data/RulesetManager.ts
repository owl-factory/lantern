import { CoreDocument, RulesetDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const RulesetManager = new DataManager<RulesetDocument>(
  "ruleset",
  {
    fetchMany,
  }
);

interface FetchManyResult {
  rulesets: RulesetDocument[];
}

/**
 * Fetches one or many rulesets from the database
 * @param ids The ids of documents to fetch
 * @returns A collection of ruleset documents
 */
async function fetchMany(ids: string[]): Promise<RulesetDocument[]> {
  const result = await rest.post<FetchManyResult>(`/api/rulesets`, { ids: ids });
  if (!result.success) { return []; }
  return result.data.rulesets;
}

import { CoreDocument, RulesetDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const RulesetManager = new DataManager<RulesetDocument>(
  "ruleset",
  {
    fetch,
    fetchMany,
  }
);

interface FetchResult {
  ruleset: RulesetDocument;
}

interface FetchManyResult {
  rulesets: RulesetDocument[];
}

async function fetch(id: string): Promise<RulesetDocument | undefined> {
  const result = await rest.get<FetchResult>(`/api/rulesets/${id}`);
  if (!result.success) { return undefined; }
  return result.data.ruleset;
}

async function fetchMany(ids: string[]): Promise<RulesetDocument[]> {
  const result = await rest.post<FetchManyResult>(`/api/rulesets`, { ids: ids });
  if (!result.success) { return []; }
  return result.data.rulesets;
}

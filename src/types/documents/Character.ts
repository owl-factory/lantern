import { RulesetDocument } from ".";
import { ImageDocument } from "./assets";
import { CampaignDocument } from "./Campaign";
import { CoreDocument } from "./CoreDocument";


export interface CharacterDocument extends CoreDocument {
  ruleset: RulesetDocument;
  campaign: CampaignDocument;
  profile: ImageDocument;
}

import { Select } from "components/style/forms";
import { CampaignCache } from "controllers/cache/CampaignCache";
import { observer } from "mobx-react-lite";
import React from "react";
import { CampaignDocument } from "types/documents";

interface CampaignSelectProps {
  name: string;
}

/**
 * Renders a dropdown for a user to select a ruleset. Handles pulling all official rulesets plus
 * any user-specific rulesets
 */
export const CampaignSelect = observer((props: CampaignSelectProps) => {
  const [ campaigns, setCampaigns ] = React.useState<Partial<CampaignDocument>[]>([]);

  React.useEffect(() => {
    const cachedCampaigns = CampaignCache.getPage({ sort: "name" });
    // TODO - include user rulesets & last used rulesets as a top option
    setCampaigns(cachedCampaigns);
  }, [CampaignCache.$lastTouched]);

  // Renders the rulesets into selectable options
  const campaignOptions: JSX.Element[] = [<option key="no-ruleset" value="">-- Select a Campaign --</option>];
  campaigns.forEach((ruleset: Partial<CampaignDocument>) => {
    campaignOptions.push(<option key={ruleset.ref} value={ruleset.ref}>{ruleset.name}</option>);
  });

  return (
    <Select name={props.name}>
      {campaignOptions}
    </Select>
  );
});

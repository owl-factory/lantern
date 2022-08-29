import { Select } from "@owl-factory/components/form";
import { Ref64 } from "@owl-factory/types";
import { CampaignData } from "controllers/data/CampaignData";
import { observer } from "mobx-react-lite";
import React from "react";

interface CampaignSelectProps {
  name: string;
}

/**
 * Renders a dropdown for a user to select a ruleset. Handles pulling all official rulesets plus
 * any user-specific rulesets
 */
export const CampaignSelect = observer((props: CampaignSelectProps) => {
  React.useEffect(() => {
    // TODO - ensure my campaigns are loaded in
  }, []);

  const campaigns = CampaignData.search({ sort: ["name"] });

  // Renders the rulesets into selectable options
  const campaignOptions: JSX.Element[] = [<option key="no-ruleset" value="">-- Select a Campaign --</option>];
  for (const campaignRef of campaigns) {
    const campaign = CampaignData.get(campaignRef);
    if (!campaign) { continue; }
    campaignOptions.push(<option key={campaign.ref} value={campaign.ref}>{campaign.name}</option>);
  }

  return (
    <Select name={props.name}>
      {campaignOptions}
    </Select>
  );
});

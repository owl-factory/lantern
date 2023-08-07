import { Select } from "components/form";
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

  // Renders the rulesets into selectable options
  const campaignOptions: JSX.Element[] = [<option key="no-ruleset" value="">-- Select a Campaign --</option>];

  return (
    <Select name={props.name}>
      {campaignOptions}
    </Select>
  );
});

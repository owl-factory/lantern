import { Select } from "@owl-factory/components/form";
import { observer } from "mobx-react-lite";
import React from "react";

interface RulesetSelectProps {
  name: string;
}

/**
 * Renders a dropdown for a user to select a ruleset. Handles pulling all official rulesets plus
 * any user-specific rulesets
 */
export const RulesetSelect = observer((props: RulesetSelectProps) => {

  // Renders the rulesets into selectable options
  const rulesetOptions: JSX.Element[] = [<option key="no-ruleset" value="">-- Select a Ruleset --</option>];

  return (
    <Select name={props.name}>
      {rulesetOptions}
    </Select>
  );
});

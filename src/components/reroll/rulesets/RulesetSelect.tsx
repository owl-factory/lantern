import { Select } from "@owl-factory/components/form";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import React from "react";
import { RulesetDocument } from "types/documents";

interface RulesetSelectProps {
  name: string;
}

/**
 * Renders a dropdown for a user to select a ruleset. Handles pulling all official rulesets plus
 * any user-specific rulesets
 */
export const RulesetSelect = observer((props: RulesetSelectProps) => {

  const rulesetRefs = RulesetData.search({ group: "data", sort: ["name"] });

  // Renders the rulesets into selectable options
  const rulesetOptions: JSX.Element[] = [<option key="no-ruleset" value="">-- Select a Ruleset --</option>];
  for (const rulesetRef of rulesetRefs) {
    const ruleset = RulesetData.get(rulesetRef);
    if (!ruleset) { continue; }
    rulesetOptions.push(<option key={ruleset.ref} value={ruleset.ref}>{ruleset.name}</option>);
  }

  return (
    <Select name={props.name}>
      {rulesetOptions}
    </Select>
  );
});

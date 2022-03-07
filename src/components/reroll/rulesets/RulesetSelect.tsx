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
  const [ rulesets, setRulesets ] = React.useState<Partial<RulesetDocument>[]>([]);

  React.useEffect(() => {
    const rulesetRefs = RulesetData.searching({ group: "data", sort: ["name"] });
    // TODO - include user rulesets & last used rulesets as a top option
    setRulesets(RulesetData.getMany(rulesetRefs));
  }, [RulesetData.$lastTouched]);

  // Renders the rulesets into selectable options
  const rulesetOptions: JSX.Element[] = [<option key="no-ruleset" value="">-- Select a Ruleset --</option>];
  rulesets.forEach((ruleset: Partial<RulesetDocument>) => {
    rulesetOptions.push(<option key={ruleset.ref} value={ruleset.ref}>{ruleset.name}</option>);
  });

  return (
    <Select name={props.name}>
      {rulesetOptions}
    </Select>
  );
});

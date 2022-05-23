import React from "react";
import { observer } from "mobx-react-lite";
import { RulesetData } from "controllers/data/RulesetData";
import { SearchParams } from "@owl-factory/data/types";

/**
 * Renders a list of ruleset select options by loading in data determined by the given parameters
 */
export const RulesetOptions = observer((props: { parameters?: SearchParams }) => {
  const options: JSX.Element[] = [];

  options.push(<option key="" value="">-- Select a Ruleset --</option>);

   // Loads in the ruleset options
   const rulesets = RulesetData.search(props.parameters);
   for (const rulesetRef of rulesets) {
     const ruleset = RulesetData.get(rulesetRef);
     if (!ruleset) { continue; }
     options.push(<option key={ruleset.ref} value={ruleset.ref}>{ruleset.name}</option>);
   }
  return (
    <>
      {options}
    </>
  );
});

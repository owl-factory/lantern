import React from "react";
import { observer } from "mobx-react-lite";

/**
 * Renders a list of ruleset select options by loading in data determined by the given parameters
 */
export const RulesetOptions = observer(() => {
  const options: JSX.Element[] = [];

  options.push(<option key="" value="">-- Select a Ruleset --</option>);

  return (
    <>
      {options}
    </>
  );
});

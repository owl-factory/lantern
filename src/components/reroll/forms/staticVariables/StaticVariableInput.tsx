import React from "react";
import { StaticVariableMetadata, StaticVariables } from "types/documents/subdocument/StaticVariable";
import { StaticVariableForm } from "./StaticVariableForm";
import { StaticVariableList } from "./StaticVariableList";

interface StaticVariableInput {
  variables: StaticVariables;
  setVariables: (staticVariables: StaticVariables) => void;
}

/**
 * Renders a list of all static variables and a form for editing them
 * @param staticVariables A dictionary of all static variables for the current document indexed by their keys
 * @param setStaticVariables A function to update the static variables
 */
export function StaticVariableInput(props: StaticVariableInput) {
  const [ selected, setSelected ] = React.useState<string | undefined>(undefined);
  return (
    <div>
      <h2>Static Variables</h2>
      <div style={{display: "flex"}}>
        <StaticVariableList
          variables={props.variables}
          setVariables={props.setVariables}
          selected={selected}
          setSelected={setSelected}
        />
        <StaticVariableForm
          variables={props.variables}
          setVariables={props.setVariables}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </div>
  );
}

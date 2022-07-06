import React from "react";
import { StaticVariable } from "types/documents/subdocument/StaticVariable";
import { StaticVariableForm } from "./StaticVariableForm";
import { StaticVariableList } from "./StaticVariableList";

interface StaticVariableInput {
  staticVariables: Record<string, StaticVariable>;
  setStaticVariables: (staticVariables: Record<string, StaticVariable>) => void;
}

/**
 * Renders a list of all static variables and a form for editing them
 * @param staticVariables A dictionary of all static variables for the current document indexed by their keys
 * @param setStaticVariables A function to update the static variables
 */
export function StaticVariableInput(props: StaticVariableInput) {
  const [ selectedVariable, setSelectedVariable ] = React.useState<string | undefined>(undefined);
  return (
    <div>
      <h2>Static Variables</h2>
      <div style={{display: "flex"}}>
        <StaticVariableList
          staticVariables={props.staticVariables}
          setStaticVariables={props.setStaticVariables}
          selectedVariable={selectedVariable}
          setSelectedVariable={setSelectedVariable}
        />
        <StaticVariableForm
          staticVariables={props.staticVariables}
          setStaticVariables={props.setStaticVariables}
          selectedVariable={selectedVariable}
          setSelectedVariable={setSelectedVariable}
        />
      </div>
    </div>
  );
}

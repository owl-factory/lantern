import React from "react";
import { StaticVariable } from "types/documents/subdocument/StaticVariable";
import { StaticVariableForm } from "./StaticVariableForm";
import { StaticVariableList } from "./StaticVariableList";

interface StaticVariableInput {
  staticVariables: Record<string, StaticVariable>;
  setStaticVariables: (staticVariables: Record<string, StaticVariable>) => void;
}

export function StaticVariableInput(props: StaticVariableInput) {
  const [ selectedVariable, setSelectedVariable ] = React.useState<string | undefined>(undefined);
  return (
    <div>
      <h2>Static Variables</h2>
      <div style={{display: "flex"}}>
        <StaticVariableList
          staticVariables={props.staticVariables}
          selectedVariable={selectedVariable}
          setSelectedVariable={setSelectedVariable}
        />
        <StaticVariableForm />
      </div>
    </div>
  );
}

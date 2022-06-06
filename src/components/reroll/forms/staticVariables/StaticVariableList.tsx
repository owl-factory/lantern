import { Button } from "@owl-factory/components/button";
import React from "react";
import { StaticVariable } from "types/documents/subdocument/StaticVariable";

interface StaticVariableListProps {
  staticVariables: Record<string, StaticVariable>;
  selectedVariable: string | undefined;
  setSelectedVariable: (key: string | undefined) => void;
}

export function StaticVariableList(props: StaticVariableListProps) {
  function addVariable() {
    return;
  }

  function removeVariable() {
    return;
  }

  return (
    <div style={{flexGrow: "1", borderStyle: "dashed", borderWidth: 1}}>
      <div>
        <Button onClick={removeVariable}>-</Button>
        <Button onClick={addVariable}>+</Button>
      </div>
    </div>
  );
}

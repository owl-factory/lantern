import { Button } from "@owl-factory/components/button";
import React from "react";
import { StaticVariable, StaticVariableScalarType } from "types/documents/subdocument/StaticVariable";
import { getNextUntitled } from "utilities/helpers";
import styles from "./StaticVariableList.module.scss";

interface StaticVariableListProps {
  staticVariables: Record<string, StaticVariable>;
  setStaticVariables: (staticVariables: Record<string, StaticVariable>) => void;
  selectedVariable: string | undefined;
  setSelectedVariable: (key: string | undefined) => void;
}


export function StaticVariableList(props: StaticVariableListProps) {
  function addVariable() {
    const keys = Object.keys(props.staticVariables);
    const untitledKey = getNextUntitled(keys);

    const newVariable = {
      name: "Untitled",
      key: untitledKey,
      description: "",
      variableType: StaticVariableScalarType.String,
      value: "",
    };

    const staticVariables = {...props.staticVariables, [untitledKey]: newVariable };
    props.setStaticVariables(staticVariables);
    props.setSelectedVariable(untitledKey);
  }

  function removeVariable() {
    if (!props.selectedVariable) { return; }
    const staticVariables = { ...props.staticVariables };
    delete staticVariables[props.selectedVariable];
    props.setStaticVariables(staticVariables);
    props.setSelectedVariable(undefined);
  }

  function selectVariable(key: string | undefined) {
    if (key === props.selectedVariable) {
      props.setSelectedVariable(undefined);
      return;
    }
    props.setSelectedVariable(key);
  }

  const items: JSX.Element[] = [];
  const keys = Object.keys(props.staticVariables).sort();
  for (const key of keys) {
    const className = props.selectedVariable === key ? styles.active : "";
    items.push(
      <div
        key={key}
        className={className}
        onClick={() => selectVariable(key)}
      >
        {props.staticVariables[key].name} ({props.staticVariables[key].key})
      </div>
    );
  }

  return (
    <div style={{flexGrow: "1", borderStyle: "dashed", borderWidth: 1}}>
      <div>
        <Button onClick={removeVariable}>-</Button>
        <Button onClick={addVariable}>+</Button>
      </div>
      <div>
        {items}
      </div>
    </div>
  );
}

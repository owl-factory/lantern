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

/**
 * Renders a list of all of the current object's static variables
 * @param staticVariables The object containing all static variables
 * @param setStaticVariables A function to update the static variables
 * @param selectedVariable The key of the currently selected variable
 * @param setSelectedVariable A function to update the selected variable
 */
export function StaticVariableList(props: StaticVariableListProps) {
  /**
   * Adds a new static variable
   */
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

  /**
   * Removes the currently selected static variable
   */
  function removeVariable() {
    if (!props.selectedVariable) { return; }
    const staticVariables = { ...props.staticVariables };
    (staticVariables[props.selectedVariable] as any) = null;
    props.setStaticVariables(staticVariables);
    props.setSelectedVariable(undefined);
  }

  /**
   * Sets a static variable key. Unselects if the variable is already selected
   * @param key The key of the variable to select
   */
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
    // Skip if this field is deleted or renamed
    if (props.staticVariables[key] === null) { continue; }
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

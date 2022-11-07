import { Button } from "@chakra-ui/react";
import React from "react";
import {
  StaticVariableScalarType,
  StaticVariables,
} from "types/documents/subdocument/StaticVariable";
import { getNextUntitled } from "utilities/helpers";
import styles from "./StaticVariableList.module.scss";

interface StaticVariableListProps {
  variables: StaticVariables;
  setVariables: (staticVariables: StaticVariables) => void;
  selected: string | undefined;
  setSelected: (key: string | undefined) => void;
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
    const keys = Object.keys(props.variables.metadata);
    const untitledKey = getNextUntitled(keys);

    const newMetadata = {
      name: "Untitled",
      key: untitledKey,
      description: "",
      variableType: StaticVariableScalarType.String,
    };

    const newValue = "";

    const metadata = {...props.variables.metadata, [untitledKey]: newMetadata };
    const values = { ...props.variables.values, [untitledKey]: newValue };
    props.setVariables({ metadata, values});
    props.setSelected(untitledKey);
  }

  /**
   * Removes the currently selected static variable
   */
  function removeVariable() {
    if (!props.selected) { return; }
    const values = { ...props.variables.values };
    const metadata = { ...props.variables.metadata };

    (values[props.selected] as any) = null;
    (metadata[props.selected] as any) = null;
    props.setVariables({ metadata, values });
    props.setSelected(undefined);
  }

  /**
   * Sets a static variable key. Unselects if the variable is already selected
   * @param key The key of the variable to select
   */
  function selectVariable(key: string | undefined) {
    if (key === props.selected) {
      props.setSelected(undefined);
      return;
    }
    props.setSelected(key);
  }

  const items: JSX.Element[] = [];
  const keys = Object.keys(props.variables.metadata).sort();
  for (const key of keys) {
    // Skip if this field is deleted or renamed
    if (props.variables.metadata[key] === null) { continue; }
    const className = props.selected === key ? styles.active : "";
    items.push(
      <div
        key={key}
        className={className}
        onClick={() => selectVariable(key)}
      >
        {props.variables.metadata[key].name} ({props.variables.metadata[key].key})
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

import { Button } from "@owl-factory/components/button";
import React from "react";
import { StaticVariableFormValues, StaticVariableObject } from "types/components/forms/staticVariables";
import { StaticVariableMetadata } from "types/documents/subdocument/StaticVariable";
import { StaticVariableObjectInput } from "./ObjectInput";
import { ObjectTypeInput } from "./ObjectTypeInput";



interface ObjectArrayInputProps {
  objectArray: StaticVariableObject[][];
  setObjectArray: (objectArray: StaticVariableObject[][]) => void;
}

/**
 * TODO - work in progress
 */
function ObjectArrayInput(props: ObjectArrayInputProps) {
  const rows: JSX.Element[] = [];

  function add() {
    const objectArray = [...props.objectArray];
  }

  function update(index: number, objectValue: StaticVariableObject[]) {
    return
  }

  function remove() {
    return
  }

  for (let i = 0; i < props.objectArray.length; i++) {
    const objectValue = props.objectArray[i];
    rows.push(
      <StaticVariableObjectInput
        objectValues={objectValue}
        setObjectValue={(value: StaticVariableObject[]) => update(i, value)}
      />
    );
  }

  return (
    <div>
      <h3>Items</h3>
      {rows}
      <Button onClick={add}>+</Button>
    </div>
  );
}

interface StaticVariableObjectArrayInputProps {
  staticVariable: StaticVariableMetadata & StaticVariableFormValues;
  setStaticVariableField: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

/**
 * Renders the inputs for modifying the type and objects within a static variable array
 * @param staticVariable The full static variable being edited currently
 * @param setStaticVariableField The function to update a single field of the current static variable
 */
export function StaticVariableObjectArrayInput(props: StaticVariableObjectArrayInputProps) {

  /**
   * Takes the new object typing and ensures that all changes are handled correctly for each of the values
   * @param objectTypes The new object typing
   */
  function updateType(objectTypes: StaticVariableObject[]) {
    props.setStaticVariableField("arr_object_type", objectTypes);
  }

  /**
   * Updates the static variable object array
   * @param objectArray The updated object array
   */
  function updateArray(objectArray: Record<string, string | number | boolean>[]) {
    props.setStaticVariableField("value_arr_obj", objectArray);
  }

  return (
    <>
      <ObjectTypeInput objectTypes={props.staticVariable.arr_object_type} setObjectTypes={updateType}/>
      {/* <ObjectArrayInput objectArray={props.staticVariable.value_arr_obj} setObjectArray={updateArray}/> */}
    </>
  );
}

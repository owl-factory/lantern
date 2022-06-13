import { Button } from "@owl-factory/components/button";
import { Input } from "@owl-factory/components/form";
import { getUniques } from "@owl-factory/utilities/arrays";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { Formik, FormikProps } from "formik";
import React, { ChangeEvent } from "react";
import { StaticVariable, StaticVariableScalarType } from "types/documents/subdocument/StaticVariable";
import { getNextUntitled } from "utilities/helpers";
import { ObjectValueType, StaticVariableFormValues } from "../StaticVariableForm";
import { StaticVariableBooleanInput } from "./BooleanInput";
import { StaticVariableNumberInput } from "./NumberInput";
import { StaticVariableTextInput } from "./TextInput";
import { TypeSelectInput } from "./TypeSelectInput";

interface ObjectValueInputProps {
  type: StaticVariableScalarType;
  onBlur: (e: ChangeEvent<any>) => void;
}

/**
 * Renders the appropriate input given the type
 * @param type The type of value being stored. Affects the displayed input
 * @param onBlur A function to run when the field loses focus. Used for updating changed values
 */
function ObjectValueInput(props: ObjectValueInputProps) {
  let ValueInput: any;
  switch (props.type) {
    case StaticVariableScalarType.String:
      ValueInput = StaticVariableTextInput;
      break;
    case StaticVariableScalarType.Number:
      ValueInput = StaticVariableNumberInput;
      break;
    case StaticVariableScalarType.Boolean:
      ValueInput = StaticVariableBooleanInput;
      break;
  }

  return (
    <ValueInput name="value" onBlur={props.onBlur}/>
  );
}

interface ObjectRowInputProps {
  index: number;
  objectValue: ObjectValueType;
  remove: (index: number) => void;
  update: (index: number, values: ObjectValueType) => void;
}

/**
 * Renders a single row for inputing a key, type, and value of an object static variable
 * @param index The index this value occupies in the values_object array
 * @param objectValue The initial value of the object input, including key, type, and value
 * @param remove A function that removes the given index from the values_object array
 * @param update A function that updates the Object Value
 */
function ObjectInputRow(props: ObjectRowInputProps) {

  /**
   * A wrapper function for the passed update function
   * @param values The changed values
   */
  function update(values: ObjectValueType) {
    props.update(props.index, values);
  }

  return (
    <Formik
      initialValues={props.objectValue}
      onSubmit={console.log}
    >
      {(formikProps: FormikProps<ObjectValueType>) => {
        React.useEffect(() => {
          formikProps.setValues(props.objectValue);
        }, [props.objectValue]);
        return (
          <TableRow>
            <TableCell><Input type="text" name="key" onBlur={() => update(formikProps.values)} /></TableCell>
            <TableCell>
              <TypeSelectInput onBlur={() => update(formikProps.values)}/>
            </TableCell>
            <TableCell>
              <ObjectValueInput type={formikProps.values.type} onBlur={() => update(formikProps.values)}/>
            </TableCell>
            <TableCell><a href="#" onClick={() => props.remove(props.index)}>X</a></TableCell>
          </TableRow>
        );
      }}
    </Formik>
  );
}

interface StaticVariableObjectInputProps {
  objectValues: ObjectValueType[];
  setObjectValue: (val: ObjectValueType[]) => void;
}

/**
 * Renders an input for creating, updating, and removing an object's fields within a static variable
 * @param objectValues The array of keys, types, and values in the object
 * @param setObjectValue A function that sets the updated object value
 */
export function StaticVariableObjectInput(props: StaticVariableObjectInputProps) {
  const rows: JSX.Element[] = [];

  /**
   * Adds a new object key/value to the object
   */
  function add() {
    const objectValues = [...props.objectValues];

    const uniqueKeys = getUniques(objectValues, "key");
    const key = getNextUntitled(uniqueKeys);
    objectValues.push({key, type: StaticVariableScalarType.String, value: ""});
    props.setObjectValue(objectValues);
  }

  /**
   * Updates an object key/value in the parent object
   * @param index The index of the object key/value to update
   * @param value The new value of the object key/value
   */
  function update(index: number, value: ObjectValueType) {
    const value_object = [...props.objectValues];
    value_object[index] = value;
    props.setObjectValue(value_object);
  }

  /**
   * Removes a single object key/value
   * @param index The index of the object key/value to remove
   */
  function remove(index: number) {
    const value_object = [...props.objectValues];
    value_object.splice(index, 1);
    props.setObjectValue(value_object);
  }

  for (let i = 0; i < props.objectValues.length; i++) {
    const objectValue = props.objectValues[i];
    rows.push(<ObjectInputRow key={i} index={i} objectValue={objectValue} update={update} remove={remove}/>);
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableHeader>Key</TableHeader>
          <TableHeader>Type</TableHeader>
          <TableHeader>Value</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableHead>

        <TableBody>
          {rows}
        </TableBody>
      </Table>
      <Button onClick={add}>+</Button>
    </>
  );
}

import { Button } from "@owl-factory/components/button";
import { getUniques } from "@owl-factory/utilities/arrays";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { Formik, FormikProps } from "formik";
import React from "react";
import { StaticVariable, StaticVariableScalarType } from "types/documents/subdocument/StaticVariable";
import { getNextUntitled } from "utilities/helpers";
import { ObjectValueType, StaticVariableFormValues } from "../StaticVariableForm";
import { StaticVariableTextInput } from "./TextInput";
import { TypeSelectInput } from "./TypeSelectInput";

interface ObjectTypeInputProps {
  objectValueTypes: ObjectValueType[];
  updateTypes: (objectTypes: ObjectValueType[]) => void;
}

function ObjectTypeInput(props: ObjectTypeInputProps) {
  const rows: JSX.Element[] = [];

  function add() {
    const objectValueTypes = [...props.objectValueTypes];
    const keys = getUniques(objectValueTypes, "key");
    const untitledKey = getNextUntitled(keys);
    objectValueTypes.push({
      key: untitledKey,
      type: StaticVariableScalarType.String,
      value: "",
    });

    props.updateTypes(objectValueTypes);
  }

  function update(index: number, values: ObjectValueType) {
    const objectValueTypes = [...props.objectValueTypes];
    objectValueTypes[index] = values;
    props.updateTypes(objectValueTypes);
  }

  function remove(index: number) {
    const objectValueTypes = [...props.objectValueTypes];
    objectValueTypes.splice(index, 1);
    props.updateTypes(objectValueTypes);
    return;
  }

  for (let i = 0; i < props.objectValueTypes.length; i++) {
    const objectValueType = props.objectValueTypes[i];
    rows.push(
      <Formik
        key={i}
        initialValues={ objectValueType }
        onSubmit={console.log}
      >
        {(formikProps: FormikProps<ObjectValueType>) => {
          React.useEffect(() => {
            formikProps.setValues(props.objectValueTypes[i]);
          }, [props.objectValueTypes[i]]);
          return (
            <TableRow>
              <TableCell><StaticVariableTextInput name="key" onBlur={() => update(i, formikProps.values)}/></TableCell>
              <TableCell><TypeSelectInput onBlur={() => update(i, formikProps.values)}/></TableCell>
              <TableCell>
                <a href="#" onClick={() => remove(i)}>X</a>
              </TableCell>
            </TableRow>
          );
        }}
      </Formik>
    );
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableHeader>Key</TableHeader>
          <TableHeader>Type</TableHeader>
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


interface ObjectArrayInputProps {
  objectArray: Record<string,  number | string | boolean>[];
  setObjectArray: (objectArray: Record<string,  number | string | boolean>[]) => void;
}

function ObjectArrayInput(props: ObjectArrayInputProps) {
  const rows: JSX.Element[] = [];

  for (const objectItem of props.objectArray)

  return (
    <>List Input</>
  );
}

interface StaticVariableObjectArrayInputProps {
  staticVariable: StaticVariable & StaticVariableFormValues;
  setStaticVariableField: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

export function StaticVariableObjectArrayInput(props: StaticVariableObjectArrayInputProps) {

  /**
   * Takes the new object typing and ensures that all changes are handled correctly for each of the values
   * @param objectTypes The new object typing
   */
  function updateType(objectTypes: ObjectValueType[]) {
    props.setStaticVariableField("arr_object_type", objectTypes);
  }

  function updateArray(objectArray: Record<string, string | number | boolean>[]) {
    props.setStaticVariableField("value_arr_obj", objectArray);
    return;
  }

  return (
    <>
      <ObjectTypeInput objectValueTypes={props.staticVariable.arr_object_type} updateTypes={updateType}/>
      <ObjectArrayInput objectArray={props.staticVariable.value_arr_obj} setObjectArray={updateArray}/>
    </>
  );
}

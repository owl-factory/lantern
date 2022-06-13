import { Button } from "@owl-factory/components/button";
import { getUniques } from "@owl-factory/utilities/arrays";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { Formik, FormikProps } from "formik";
import React from "react";
import { StaticVariableObject } from "types/components/forms/staticVariables";
import { StaticVariableScalarType } from "types/documents/subdocument/StaticVariable";
import { getNextUntitled } from "utilities/helpers";
import { StaticVariableTextInput } from "./TextInput";
import { TypeSelectInput } from "./TypeSelectInput";

interface ObjectTypeInputProps {
  objectTypes: StaticVariableObject[];
  setObjectTypes: (objectTypes: StaticVariableObject[]) => void;
}

/**
 * Renders a list of all keys, their types, and their default value
 * @param objectTypes A list of object types
 * @param setObjectTypes A function to set the object types
 */
export function ObjectTypeInput(props: ObjectTypeInputProps) {
  const rows: JSX.Element[] = [];

  /**
   * Adds a new key and type to the object type definition
   */
  function add() {
    const objectTypes = [...props.objectTypes];
    const keys = getUniques(objectTypes, "key");
    const untitledKey = getNextUntitled(keys);
    objectTypes.push({
      key: untitledKey,
      type: StaticVariableScalarType.String,
      value: "",
    });

    props.setObjectTypes(objectTypes);
  }

  /**
   * Updates a single key and type of the object type definition
   * @param index The index of the key and type to update
   * @param values The new values of the key and type
   */
  function update(index: number, values: StaticVariableObject) {
    const objectTypes = [...props.objectTypes];
    const oldObjectType = objectTypes[index];
    if (oldObjectType.key !== values.key) { values.oldKey = oldObjectType.key; }
    objectTypes[index] = values;
    props.setObjectTypes(objectTypes);
  }

  /**
   * Removes a single key and type from the object type definition
   * @param index The index of the key and type to remove
   */
  function remove(index: number) {
    const objectValueTypes = [...props.objectTypes];
    objectValueTypes.splice(index, 1);
    props.setObjectTypes(objectValueTypes);
  }

  for (let i = 0; i < props.objectTypes.length; i++) {
    const objectValueType = props.objectTypes[i];
    rows.push(
      <Formik
        key={i}
        initialValues={ objectValueType }
        onSubmit={console.log}
      >
        {(formikProps: FormikProps<StaticVariableObject>) => {
          // UseEffect is to handle updating the form if an element is deleted
          React.useEffect(() => {
            formikProps.setValues(props.objectTypes[i]);
          }, [props.objectTypes[i]]);
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

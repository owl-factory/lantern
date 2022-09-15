import { Button } from "@chakra-ui/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { Formik, FormikProps } from "formik";
import React from "react";
import { StaticVariableFormValues } from "types/components/forms/staticVariables";
import { StaticVariableComplexType, StaticVariableMetadata } from "types/documents/subdocument/StaticVariable";
import { StaticVariableNumberInput } from "./NumberInput";
import { StaticVariableTextInput } from "./TextInput";

interface StaticVariableScalarArrayInputProps {
  staticVariable: StaticVariableMetadata & StaticVariableFormValues;
  setStaticVariableField: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

/**
 * Renders a form for adding, editing, and removing scalar elements from the static variable values
 * @param staticVariable The currently editable static variable
 * @param setStaticVariableField Updates a single field of the currently editable static variable
 */
export function StaticVariableScalarArrayInput(props: StaticVariableScalarArrayInputProps) {
  let field: "value_arr_string" | "value_arr_number" | "value_arr_boolean";
  let defaultValue: (string | number | boolean) = false;
  let Input: any;

  const rows: JSX.Element[] = [];

  switch (props.staticVariable.variableType) {
    case StaticVariableComplexType.StringArray:
      field = "value_arr_string";
      defaultValue = "";
      Input = StaticVariableTextInput;
      break;
    case StaticVariableComplexType.NumberArray:
      field = "value_arr_number";
      defaultValue = 0;
      Input = StaticVariableNumberInput;
      break;
    case StaticVariableComplexType.BooleanArray:
      field = "value_arr_boolean";
      defaultValue = false;
      break;
    default:
      return <></>;
  }

  /**
   * Adds a new element to the scalar array
   */
  function add() {
    const arr = [...props.staticVariable[field]];
    arr.push(defaultValue);
    props.setStaticVariableField(field, arr);
  }

  /**
   * Removes a single entry from the array
   * @param index The index of the value to remove
   */
  function remove(index: number) {
    const arr = [...props.staticVariable[field]];
    arr.splice(index, 1);
    props.setStaticVariableField(field, arr);
  }

  /**
   * Updates the scalar array to have the given value
   * @param index The index of the value to update
   * @param value The new value to save
   */
  function update(index: number, value: any) {
    const arr = [...props.staticVariable[field]];
    arr[index] = value;
    props.setStaticVariableField(field, arr);
  }

  for (let i = 0; i < props.staticVariable[field].length; i++) {
    rows.push(
      <Formik
        initialValues={{value: props.staticVariable[field][i]}}
        onSubmit={console.log}
        key={i}
      >
        {(formikProps: FormikProps<any>) => {
          // useEffect is here to reset the form if a row is deleted
          React.useEffect(() => {
            formikProps.setValues({
              value: props.staticVariable[field][i],
            });
          }, [props.staticVariable[field][i]]);
          return (
            <TableRow >
              <TableCell></TableCell>
              <TableCell>{i}</TableCell>
              <TableCell><Input name="value" onBlur={() => update(i, formikProps.values.value)} /></TableCell>
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
          <TableHeader></TableHeader>
          <TableHeader>#</TableHeader>
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

import { Button } from "@owl-factory/components/button";
import { Input, Select } from "@owl-factory/components/form";
import { Formik, FormikProps } from "formik";
import React from "react";
import {
  StaticVariable,
  StaticVariableComplexType,
  StaticVariableScalarType,
} from "types/documents/subdocument/StaticVariable";
import { StaticVariableValueInput } from "./StaticVariableValueInput";

// Scaffolding values for making processing of the different form options easier to do
interface StaticVariableFormValues {
  oldKey: string;

  value_string: string;
  value_number: number;
  value_boolean: boolean;
  value_obj: Record<string, number | string | boolean>;
  value_arr_string: string[];
  value_arr_number: number[];
  value_arr_boolean: boolean[];
  value_arr_obj: Record<string, number | string | boolean>[];
}

/**
 * A standard element for a fail state
 */
function NullForm() {
  return (
    <div style={{flexGrow: 1}}></div>
  );
}

/**
 * Processes the raw values from the static variable form. Removes all scaffolding values
 * @param values The values from the StaticVariable form to process
 * @returns The processed and cleaned static variable values
 */
function processStaticValues(values: StaticVariable & StaticVariableFormValues) {
  switch (values.variableType) {
    case StaticVariableScalarType.String:
      values.value = values.value_string;
      delete values.objectType;
      break;
    case StaticVariableScalarType.Number:
      values.value = values.value_number;
      delete values.objectType;
      break;
    case StaticVariableScalarType.Boolean:
      values.value = values.value_boolean;
      delete values.objectType;
      break;
    case StaticVariableComplexType.Object:
      values.value = values.value_obj;
      break;
    case StaticVariableComplexType.StringArray:
      values.value = values.value_arr_string;
      delete values.objectType;
      break;
    case StaticVariableComplexType.NumberArray:
      values.value = values.value_arr_number;
      delete values.objectType;
      break;
    case StaticVariableComplexType.BooleanArray:
      values.value = values.value_arr_boolean;
      delete values.objectType;
      break;
    case StaticVariableComplexType.ObjectArray:
      values.value = values.value_arr_obj;
      break;
  }

  // Packages up the values into a static variable
  const staticVariable: StaticVariable = {
    name: values.name,
    key: values.key,
    description: values.description,
    variableType: values.variableType,
    objectType: values.objectType,
    value: values.value,
  }

  return staticVariable;
}

interface StaticVariableFormProps {
  staticVariables: Record<string, StaticVariable>;
  setStaticVariables: (staticVariables: Record<string, StaticVariable>) => void;
  selectedVariable: string | undefined;
  setSelectedVariable: (selectedVariable: string | undefined) => void;
}

/**
 * Renders the form for editing a static variable
 * @param staticVariables The full list of static variables
 * @param setStaticVariables A function to update and set all static variables
 * @param selectedVariable The key of the currently selected static variable
 * @param setSelectedVariable A function to update the currently selected static variable
 * @returns 
 */
export function StaticVariableForm(props: StaticVariableFormProps) {
  if (!props.selectedVariable) { return <NullForm/>; }
  const staticVariable = props.staticVariables[props.selectedVariable];
  if (!props.staticVariables[props.selectedVariable]) { return <NullForm/>; }

  // Builds the initial values for the form. Ensures that the StaticVariableFormValues are all set
  const initialValues: StaticVariable & StaticVariableFormValues = { 
    ...staticVariable,
    oldKey: props.staticVariables[props.selectedVariable].key,
    value_string: staticVariable.variableType === StaticVariableScalarType.String ? (staticVariable.value as string) : "",
    value_number: staticVariable.variableType === StaticVariableScalarType.Number ? (staticVariable.value as number) : 0,
    value_boolean: staticVariable.variableType === StaticVariableScalarType.Boolean ? (staticVariable.value as boolean) : false,
    value_obj: staticVariable.variableType === StaticVariableComplexType.Object ? (staticVariable.value as Record<string, string | number | boolean>) : {},
    value_arr_string: staticVariable.variableType === StaticVariableComplexType.StringArray ? (staticVariable.value as string[]) : [],
    value_arr_number: staticVariable.variableType === StaticVariableComplexType.NumberArray ? (staticVariable.value as number[]) : [],
    value_arr_boolean: staticVariable.variableType === StaticVariableComplexType.BooleanArray ? (staticVariable.value as boolean[]) : [],
    value_arr_obj: staticVariable.variableType === StaticVariableComplexType.ObjectArray ? (staticVariable.value as Record<string, string | number | boolean>[]) : [],
  };
  
  function onSubmit(values: StaticVariable & StaticVariableFormValues) {
    if (!props.selectedVariable) { return; }
    const staticVariables = { ...props.staticVariables };
    (staticVariables[props.selectedVariable] as any) = null;
    staticVariables[values.key] = processStaticValues(values);
    props.setStaticVariables(staticVariables);
    props.setSelectedVariable(undefined);
  }

  return (
    <div style={{flexGrow: 1}}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {(formikProps: FormikProps<StaticVariable>) => {
          if (staticVariable.key !== (formikProps.values as any).oldKey) { formikProps.setValues(staticVariable); }
          return (
            <>
              <label htmlFor="sv_name">Name</label>
              <Input id="sv_name" name="name" type="text"/>
              <label htmlFor="sv_key">Key</label>
              <Input id="sv_key" name="key" type="text"/>

              <label htmlFor="sv_key">Description</label>
              <Input id="sv_key" name="description" type="text"/>

              <label htmlFor="sv_key">Key</label>
              <Select id="sh_variableType" name="variableType">
                <option value={StaticVariableScalarType.String}>Text</option>
                <option value={StaticVariableScalarType.Number}>Number</option>
                <option value={StaticVariableScalarType.Boolean}>True / False</option>

                <option value={StaticVariableComplexType.Object}>Object</option>
                <option value={StaticVariableComplexType.StringArray}>List of Text</option>
                <option value={StaticVariableComplexType.NumberArray}>List of Numbers</option>
                <option value={StaticVariableComplexType.BooleanArray}>List of True/False</option>
                <option value={StaticVariableComplexType.ObjectArray}>List of Objects</option>
              </Select>

              <StaticVariableValueInput variableType={formikProps.values.variableType} />

              <Button type="button" onClick={() => props.setSelectedVariable(undefined)}>Cancel</Button>
              <Button onClick={formikProps.submitForm}>Save</Button>
            </>
          );
        }}
      </Formik>
    </div>
  );
}

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

export interface ObjectValueType {
  key: string;
  type: StaticVariableScalarType;
  value: string | number | boolean;
}


// Scaffolding values for making processing of the different form options easier to do
export interface StaticVariableFormValues {
  oldKey: string;

  value_string: string;
  value_number: number;
  value_boolean: boolean;
  value_obj: ObjectValueType[];
  value_arr_string: string[];
  value_arr_number: number[];
  value_arr_boolean: boolean[];
  value_arr_obj: Record<string, number | string | boolean>[];

  arr_object_type: ObjectValueType[];
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
 * Builds initial values from the default starting static variable values
 * @param staticVariable The given static variable to build initial values from
 */
function buildInitialValues(staticVariable: StaticVariable) {
  const initialValues: StaticVariable & StaticVariableFormValues = {
    ...staticVariable,
    oldKey: staticVariable.key,
    value_string: "",
    value_number: 0,
    value_boolean: false,
    value_obj: [],
    value_arr_string: [],
    value_arr_number: [],
    value_arr_boolean: [],
    value_arr_obj: [],
    arr_object_type: [],
  };

  let keys: string[];

  switch (staticVariable.variableType) {
    case StaticVariableScalarType.String:
      initialValues.value_string = staticVariable.value as string;
      break;
    case StaticVariableScalarType.Number:
      initialValues.value_number = staticVariable.value as number;
      break;
    case StaticVariableScalarType.Boolean:
      initialValues.value_boolean = staticVariable.value as boolean;
      break;
    case StaticVariableComplexType.Object:
      if (!staticVariable.objectType) { break; }
      keys = Object.keys(staticVariable.objectType).sort();
      for (const key of keys) {
        const value: ObjectValueType = {
          key,
          type: staticVariable.objectType[key],
          value: (staticVariable.value as any)[key],
        };
        initialValues.value_obj.push(value);
      }
      break;
    case StaticVariableComplexType.StringArray:
      initialValues.value_arr_string = staticVariable.value as string[];
      break;
    case StaticVariableComplexType.NumberArray:
      initialValues.value_arr_number = staticVariable.value as number[];
      break;
    case StaticVariableComplexType.BooleanArray:
      initialValues.value_arr_boolean = staticVariable.value as boolean[];
      break;
    case StaticVariableComplexType.ObjectArray:
      if (!staticVariable.objectType) { break; }
      keys = Object.keys(staticVariable.objectType).sort();
      for (const key of keys) {
        const value: ObjectValueType = {
          key,
          type: staticVariable.objectType[key],
          value: (staticVariable.value as any)[key],
        };
        initialValues.arr_object_type.push(value);
      }
      initialValues.value_arr_obj = staticVariable.value as Record<string, string | number | boolean>[];
      break;
  }
  return initialValues;
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
      values.objectType = {};
      values.value = {};
      for (const value of values.value_obj) {
        values.objectType[value.key] = value.type;
        values.value[value.key] = value.value;
      }
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
      values.objectType = {};
      for (const value of values.arr_object_type) {
        values.objectType[value.key] = value.type;
      }
      console.log(values.objectType)
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
  };

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
 */
export function StaticVariableForm(props: StaticVariableFormProps) {
  if (!props.selectedVariable) { return <NullForm/>; }
  const staticVariable = props.staticVariables[props.selectedVariable];
  if (!props.staticVariables[props.selectedVariable]) { return <NullForm/>; }

  // Builds the initial values for the form. Ensures that the StaticVariableFormValues are all set
  const initialValues = buildInitialValues(staticVariable);

  /**
   * Submits the Static Variable form
   * @param values The raw form values to submit
   */
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
        {(formikProps: FormikProps<StaticVariable & StaticVariableFormValues>) => {
          if (staticVariable.key !== (formikProps.values as any).oldKey) { formikProps.setValues(initialValues); }
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

              <StaticVariableValueInput
                staticVariable={formikProps.values}
                setStaticVariableField={formikProps.setFieldValue}
              />

              <Button type="button" onClick={() => props.setSelectedVariable(undefined)}>Cancel</Button>
              <Button onClick={formikProps.submitForm}>Save</Button>
            </>
          );
        }}
      </Formik>
    </div>
  );
}

import { Button } from "@owl-factory/components/button";
import { Input, Select } from "@owl-factory/components/form";
import { Formik, FormikProps } from "formik";
import React from "react";
import {
  StaticVariable,
  StaticVariableComplexType,
  StaticVariableScalarType,
} from "types/documents/subdocument/StaticVariable";
import { StaticVariableInput } from "./StaticVariableInput";
import { StaticVariableValueInput } from "./StaticVariableValueInput";

interface StaticVariableFormValues {
  value_string: string,
  value_number: number;
  value_boolean: boolean;
  value_obj: Record<string, number | string | boolean>;
  value_arr_string: string[];
  value_arr_number: number[];
  value_arr_boolean: boolean[];
  value_arr_obj: Record<string, number | string | boolean>[];
}

function NullForm() {
  return (
    <div style={{flexGrow: 1}}></div>
  );
}

interface StaticVariableFormProps {
  staticVariables: Record<string, StaticVariable>;
  setStaticVariables: (staticVariables: Record<string, StaticVariable>) => void;
  selectedVariable: string | undefined;
  setSelectedVariable: (selectedVariable: string | undefined) => void;
}

export function StaticVariableForm(props: StaticVariableFormProps) {
  if (!props.selectedVariable) { return <NullForm/>; }
  const staticVariable = props.staticVariables[props.selectedVariable];
  if (!staticVariable) { return <NullForm/>; }
  (staticVariable as any).oldKey = staticVariable.key;

  function onSubmit(values: StaticVariable) {
    if (!props.selectedVariable) { return; }
    const staticVariables = { ...props.staticVariables };
    delete staticVariables[props.selectedVariable];
    staticVariables[values.key] = values;
    props.setStaticVariables(staticVariables);
    props.setSelectedVariable(undefined);
  }

  return (
    <div style={{flexGrow: 1}}>
      <Formik
        initialValues={staticVariable}
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

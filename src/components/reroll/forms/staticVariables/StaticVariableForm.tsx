import { Button } from "@owl-factory/components/button";
import { Input, Select } from "@owl-factory/components/form";
import { Formik, FormikProps } from "formik";
import React from "react";
import { StaticVariableFormValues } from "types/components/forms/staticVariables";
import {
  StaticVariable,
  StaticVariableComplexType,
  StaticVariableScalarType,
} from "types/documents/subdocument/StaticVariable";
import { buildInitialValues, processStaticValues } from "utilities/staticVariable/helpers";
import { StaticVariableValueInput } from "./StaticVariableValueInput";


/**
 * A standard element for a fail state
 */
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

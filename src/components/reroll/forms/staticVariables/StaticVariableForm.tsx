import { Button, Input, Select } from "@chakra-ui/react";
import { Formik, FormikProps } from "formik";
import React from "react";
import { StaticVariableFormValues } from "types/components/forms/staticVariables";
import {
  StaticVariableComplexType,
  StaticVariableMetadata,
  StaticVariableScalarType,
  StaticVariables,
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
  variables: StaticVariables;
  setVariables: (staticVariables: StaticVariables) => void;
  selected: string | undefined;
  setSelected: (selectedVariable: string | undefined) => void;
}

/**
 * Renders the form for editing a static variable
 * @param variables The full list of static variables
 * @param setVariables A function to update and set all static variables
 * @param selected The key of the currently selected static variable
 * @param setSelected A function to update the currently selected static variable
 */
export function StaticVariableForm(props: StaticVariableFormProps) {
  if (!props.selected) { return <NullForm/>; }
  const currentMetadata = props.variables.metadata[props.selected];
  const currentValue = props.variables.values[props.selected];
  if (!currentMetadata) { return <NullForm/>; }

  // Builds the initial values for the form. Ensures that the StaticVariableFormValues are all set
  const initialValues = buildInitialValues(currentValue, currentMetadata);

  /**
   * Submits the Static Variable form
   * @param formValues The raw form values to submit
   */
  function onSubmit(formValues: StaticVariableMetadata & StaticVariableFormValues) {
    if (!props.selected) { return; }
    const metadata = { ...props.variables.metadata };
    const values = { ...props.variables.values };
    (metadata[props.selected] as any) = null;
    (values[props.selected] as any) = null;
    const processedValues = processStaticValues(formValues);

    values[formValues.key] = processedValues.value;
    metadata[formValues.key] = processedValues.metadata;
    props.setVariables({ metadata, values });
    props.setSelected(undefined);
  }

  return (
    <div style={{flexGrow: 1}}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {(formikProps: FormikProps<StaticVariableMetadata & StaticVariableFormValues>) => {
          if (currentMetadata.key !== (formikProps.values as any).oldKey) { formikProps.setValues(initialValues); }
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

              <Button type="button" onClick={() => props.setSelected(undefined)}>Cancel</Button>
              <Button onClick={formikProps.submitForm}>Save</Button>
            </>
          );
        }}
      </Formik>
    </div>
  );
}

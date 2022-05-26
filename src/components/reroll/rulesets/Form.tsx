import { Button } from "@owl-factory/components/button";
import { Input } from "@owl-factory/components/form";
import { RulesetData } from "controllers/data/RulesetData";
import { Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { RulesetDocument } from "types/documents";
import { CustomFieldInput } from "../forms/customFields/CustomFieldInput";

// The initial values of the form
const INITIAL_VALUES = {
  ref: "",
  name: "",
  alias: "",
  variables: {},
};

/**
 * Renders a form for creating or editing a ruleset
 * @param props.ruleset A pre-existing ruleset to edit
 */
export function RulesetForm(props: { ruleset?: Partial<RulesetDocument> }) {
  const router = useRouter();
  const initialValues = props.ruleset || INITIAL_VALUES;
  if (!initialValues.variables) {
    // initialValues.variables = {};
  }

  if (props.ruleset && !RulesetData.isLoaded(props.ruleset.ref)) {
    return <></>;
  }

  /**
   * Submits the form values to create or update a ruleset
   * @param values The ruleset values from the form
   */
  function onSubmit(values: Partial<RulesetDocument>) {
    try {
      if (values.ref) { RulesetData.update(values).then(() => router.push(`/dev/rulesets`)); }
      else { RulesetData.create(values).then(() => router.push(`/dev/rulesets`)); }

    } catch (e) {
      console.error(e);
    }
  }

  console.log("Ruleset", props.ruleset?.variables)

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<Partial<RulesetDocument>>) => (
        <Form>
          <Input name="name" type="text" label="Name"/>
          <Input name="alias" type="text" label="Alias"/>

          <CustomFieldInput field="variables" onChange={formikProps.setFieldValue} values={formikProps.values}/>

          <Button type="button" onClick={() => formikProps.resetForm}>Reset</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
}



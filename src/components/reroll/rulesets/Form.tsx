import { Button } from "@owl-factory/components/button";
import { Input } from "@owl-factory/components/form";
import { RulesetData } from "controllers/data/RulesetData";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { RulesetDocument } from "types/documents";

const INITIAL_VALUES = {
  ref: "",
  name: "",
  alias: "",
};

function onSubmit(values: Partial<RulesetDocument>) {
  try {
    if (values.ref) { RulesetData.update(values); }
    else { RulesetData.create(values); }
  } catch (e) {
    console.error(e);
  }
}

export function RulesetForm(props: any) {
  const initialValues = props.ruleset || INITIAL_VALUES;
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<Partial<RulesetDocument>>) => (
        <Form>
          <Input name="name" type="text" label="Name"/>
          <Input name="alias" type="text" label="Alias"/>
          <Button type="button" onClick={() => formikProps.resetForm}>Reset</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
}

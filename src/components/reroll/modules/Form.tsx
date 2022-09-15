import { Button } from "@chakra-ui/react";
import { Input, Select } from "@owl-factory/components/form";
import { Module } from "@prisma/client";
import { Form, Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import React from "react";
import { ModuleDocument } from "types/documents";

const INITIAL_VALUES = {
  ref: "",
  name: "",
  alias: "",
};

/**
 * Renders a form for creating or updating a module
 * @param module The pre-existing module to edit
 * @param rulesetRef The ruleset this module belongs to
 */
export const ModuleForm = observer((props: { module?: Module, rulesetRef: string }) => {
  // Ensures that the data is pulled in from the database
  const router = useRouter();
  const initialValues = props.module || INITIAL_VALUES;

  /**
   * Submits the form values to create or update a module
   * @param values The module values from the form
   */
  function onSubmit(values: Partial<Module>) {
    // Ensures that the ruleset values are present and up to date
    return;
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<Partial<Module>>) => (
        <Form>
          <Input name="name" type="text" label="Name"/>
          <Input name="alias" type="text" label="Alias"/>
          <Button type="button" onClick={() => formikProps.resetForm}>Reset</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
});

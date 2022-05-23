import { Button } from "@owl-factory/components/button";
import { Input, Select } from "@owl-factory/components/form";
import { ModuleData } from "controllers/data/ModuleData";
import { RulesetData } from "controllers/data/RulesetData";
import { Form, Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import React from "react";
import { ModuleDocument } from "types/documents";
import { RulesetOptions } from "../rulesets/Options";

const INITIAL_VALUES = {
  ref: "",
  name: "",
  alias: "",
  "ruleset.ref": null,
};

/**
 * Renders a form for creating or updating a module
 */
export const ModuleForm = observer((props: { module?: Partial<ModuleDocument> }) => {
  // Ensures that the data is pulled in from the database
  React.useEffect(() => {
    RulesetData.searchIndex(`/api/rulesets/list`);
  }, []);

  const router = useRouter();
  const initialValues = props.module || INITIAL_VALUES;

  /**
   * Submits the form values to create or update a module
   * @param values The module values from the form
   */
  function onSubmit(values: Partial<ModuleDocument>) {
    try {
      if (values.ref) { ModuleData.update(values).then(() => router.push(`/dev/modules`)); }
      else { ModuleData.create(values).then(() => router.push(`/dev/modules`)); }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<Partial<ModuleDocument>>) => (
        <Form>
          <Input name="name" type="text" label="Name"/>
          <Input name="alias" type="text" label="Alias"/>
          <Select name="ruleset.ref">
            <RulesetOptions parameters={{ group: "data" }}/>
          </Select>
          <Button type="button" onClick={() => formikProps.resetForm}>Reset</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
});

import { Button } from "@owl-factory/components/button";
import { Input, Select } from "@owl-factory/components/form";
import { ModuleData } from "controllers/data/ModuleData";
import { RulesetData } from "controllers/data/RulesetData";
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
export const ModuleForm = observer((props: { module?: Partial<ModuleDocument>, rulesetRef: string }) => {
  // Ensures that the data is pulled in from the database
  const router = useRouter();
  const initialValues = props.module || INITIAL_VALUES;
  const ruleset = RulesetData.get(props.rulesetRef);

  React.useEffect(() => {
    RulesetData.load(props.rulesetRef);
  }, [props.rulesetRef]);

  /**
   * Submits the form values to create or update a module
   * @param values The module values from the form
   */
  function onSubmit(values: Partial<ModuleDocument>) {
    // Ensures that the ruleset values are present and up to date
    if (!ruleset) { return; }
    values.ruleset = { ref: ruleset.ref as string, name: ruleset.name as string };
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
          <Button type="button" onClick={() => formikProps.resetForm}>Reset</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
});

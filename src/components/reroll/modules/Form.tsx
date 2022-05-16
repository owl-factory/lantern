import { Button } from "@owl-factory/components/button";
import { Input, Select } from "@owl-factory/components/form";
import { ModuleData } from "controllers/data/ModuleData";
import { RulesetData } from "controllers/data/RulesetData";
import { Form, Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { ModuleDocument } from "types/documents";

const INITIAL_VALUES = {
  ref: "",
  name: "",
  alias: "",
};

function onSubmit(values: Partial<ModuleDocument>) {
  try {
    if (values.ref) { ModuleData.update(values); }
    else { ModuleData.create(values); }
  } catch (e) {
    console.error(e);
  }
}

export const ModuleForm = observer((props: any) => {
  // Ensures that the data is pulled in from the database
  React.useEffect(() => {
    RulesetData.searchIndex(`/api/rulesets/list`);
  }, []);

  const initialValues = props.module || INITIAL_VALUES;

  // Loads in the ruleset options
  const rulesets = RulesetData.search({ group: "data" });
  const options: JSX.Element[] = [<option key="" value="">-- Select a Ruleset --</option>];
  for (const rulesetRef of rulesets) {
    const ruleset = RulesetData.get(rulesetRef);
    if (!ruleset) { continue; }
    options.push(<option key={ruleset.ref} value={ruleset.ref}>{ruleset.name}</option>);
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
            {options}
          </Select>
          <Button type="button" onClick={() => formikProps.resetForm}>Reset</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
});

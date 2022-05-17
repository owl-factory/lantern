import { Button } from "@owl-factory/components/button";
import { Input, Select } from "@owl-factory/components/form";
import { ContentTypeData } from "controllers/data/ContentTypeData";
import { RulesetData } from "controllers/data/RulesetData";
import { Form, Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { ContentTypeDocument } from "types/documents";
import { RulesetOptions } from "../rulesets/Options";
import { ContentTypeOptions } from "./Options";

const INITIAL_VALUES = {
  name: "",
  alias: "",
  "ruleset.ref": "",
};

function onSubmit(values: Partial<ContentTypeDocument>) {
  try {
    if (values.ref) { ContentTypeData.update(values); }
    else { ContentTypeData.create(values); }
  } catch (e) {
    console.error(e);
  }
}

export const ContentTypeForm = observer((props: any) => {
  React.useEffect(() => {
    RulesetData.searchIndex(`/api/rulesets/list`);
    ContentTypeData.searchIndex(`/api/content-types/list`);
  }, []);

  const initialValues = props.contentType || INITIAL_VALUES;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<Partial<ContentTypeDocument>>) => (
        <Form>
          <Input name="name" type="text" label="Name"/>
          <Input name="alias" type="text" label="Alias"/>

          <Select name="ruleset.ref">
            <RulesetOptions parameters={{ group: "data" }}/>
          </Select>

          <Select name="parent.ref">
            <ContentTypeOptions parameters={{ group: "data" }}/>
          </Select>

          <Button type="button" onClick={() => formikProps.resetForm}>Reset</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
});

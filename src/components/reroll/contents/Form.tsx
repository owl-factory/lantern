import { Button } from "@owl-factory/components/button";
import { Input, Select } from "@owl-factory/components/form";
import { ContentData } from "controllers/data/ContentData";
import { ContentTypeData } from "controllers/data/ContentTypeData";
import { RulesetData } from "controllers/data/RulesetData";
import { Form, Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { ContentTypeDocument } from "types/documents";
import { ContentTypeOptions } from "../contentTypes/Options";
import { RulesetOptions } from "../rulesets/Options";

const INITIAL_VALUES = {
  name: "",
  alias: "",
  "ruleset.ref": "",
  "contentType.ref": "",
};

function onSubmit(values: Partial<ContentTypeDocument>) {
  try {
    if (values.ref) { ContentData.update(values); }
    else { ContentData.create(values); }
  } catch (e) {
    console.error(e);
  }
}

export const ContentForm = observer((props: any) => {
  React.useEffect(() => {
    RulesetData.searchIndex(`/api/rulesets/list`);
    ContentTypeData.searchIndex(`/api/content-types/list`);
  }, []);

  const initialValues = props.content || INITIAL_VALUES;

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

          <Select name="contentType.ref">
            <ContentTypeOptions parameters={{ group: "data" }}/>
          </Select>

          <Button type="button" onClick={() => formikProps.resetForm}>Reset</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
});

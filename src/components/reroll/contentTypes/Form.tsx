import { Button } from "@owl-factory/components/button";
import { Input, Select } from "@owl-factory/components/form";
import { ContentTypeData } from "controllers/data/ContentTypeData";
import { RulesetData } from "controllers/data/RulesetData";
import { Form, Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import React from "react";
import { ContentTypeDocument } from "types/documents";
import { CustomFieldInput } from "../forms/customFields/CustomFieldInput";
import { RulesetOptions } from "../rulesets/Options";
import { ContentTypeOptions } from "./Options";

const INITIAL_VALUES = {
  name: "",
  alias: "",
  "ruleset.ref": "",
};

/**
 * Renders a form for creating or editing a content type
 */
export const ContentTypeForm = observer((props: { contentType?: Partial<ContentTypeDocument> }) => {
  // Ensures that the data is pulled in from the database.
  // TODO - this should be handled outside the form
  React.useEffect(() => {
    RulesetData.searchIndex(`/api/rulesets/list`);
    ContentTypeData.searchIndex(`/api/content-types/list`);
  }, []);

  const router = useRouter();
  const initialValues = props.contentType || INITIAL_VALUES;

  /**
   * Submits the form values to create or update a content type
   * @param values The content type values from the form
   */
  function onSubmit(values: Partial<ContentTypeDocument>) {
    try {
      if (values.ref) { ContentTypeData.update(values).then(() => router.push(`/dev/content-types`)); }
      else { ContentTypeData.create(values).then(() => router.push(`/dev/content-types`)); }
    } catch (e) {
      console.error(e);
    }
  }

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

          <CustomFieldInput field="variables" onChange={formikProps.setFieldValue} values={formikProps.values}/>

          <Button type="button" onClick={() => formikProps.resetForm}>Reset</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
});

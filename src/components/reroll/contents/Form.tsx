import { Button } from "@owl-factory/components/button";
import { Input, Select } from "@owl-factory/components/form";
import { ContentData } from "controllers/data/ContentData";
import { ContentTypeData } from "controllers/data/ContentTypeData";
import { RulesetData } from "controllers/data/RulesetData";
import { Form, Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import React from "react";
import { ContentDocument, ContentTypeDocument } from "types/documents";
import { ContentTypeOptions } from "../contentTypes/Options";
import { RulesetOptions } from "../rulesets/Options";

const INITIAL_VALUES = {
  name: "",
  alias: "",
  "ruleset.ref": "",
  "contentType.ref": "",
};

/**
 * Renders a form for creating or updating content
 */
export const ContentForm = observer((props: { content?: Partial<ContentDocument> }) => {
  // Ensures this data is loaded.
  // TODO - move higher up
  React.useEffect(() => {
    RulesetData.searchIndex(`/api/rulesets/list`);
    ContentTypeData.searchIndex(`/api/content-types/list`);
  }, []);

  const router = useRouter();
  const initialValues = props.content || INITIAL_VALUES;

  /**
   * Submits the form values to create or update a content
   * @param values The content values from the form
   */
  function onSubmit(values: Partial<ContentDocument>) {
    try {
      if (values.ref) { ContentData.update(values).then(() => { router.push(`/dev/contents`); }); }
      else { ContentData.create(values).then(() => { router.push(`/dev/contents`); }); }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<Partial<ContentDocument>>) => (
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

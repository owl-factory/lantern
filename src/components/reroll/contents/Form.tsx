import { Button } from "@owl-factory/components/button";
import { Input, Select } from "@owl-factory/components/form";
import { Content } from "@prisma/client";
import { Form, Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import React from "react";
import { ContentDocument } from "types/documents";
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
export const ContentForm = observer((props: { content?: Content }) => {
  const router = useRouter();
  const initialValues = props.content || INITIAL_VALUES;

  /**
   * Submits the form values to create or update a content
   * @param values The content values from the form
   */
  function onSubmit(values: Partial<Content>) {
    return;
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<Partial<Content>>) => (
        <Form>
          <Input name="name" type="text" label="Name"/>
          <Input name="alias" type="text" label="Alias"/>

          <Select name="ruleset.ref">
            <RulesetOptions />
          </Select>

          <Select name="contentType.ref">
            <ContentTypeOptions />
          </Select>

          <Button type="button" onClick={() => formikProps.resetForm}>Reset</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
});

import { Button, Input, Select } from "@chakra-ui/react";
import { ContentType } from "@prisma/client";
import { Form, Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import React from "react";
import { CustomFieldInput } from "../forms/customFields/CustomFieldInput";
import { RulesetOptions } from "../rulesets/Options";
import { ContentTypeOptions } from "./Options";

const INITIAL_VALUES = {
  name: "",
  alias: "",
  rulesetID: "",
};

/**
 * Renders a form for creating or editing a content type
 */
export const ContentTypeForm = observer((props: { contentType?: ContentType }) => {

  const router = useRouter();
  const initialValues = props.contentType || INITIAL_VALUES;

  /**
   * Submits the form values to create or update a content type
   * @param values The content type values from the form
   */
  function onSubmit(values: Partial<ContentType>) {
    return;
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<Partial<ContentType>>) => (
        <Form>
          <Input name="name" type="text" placeholder="Name"/>
          <Input name="alias" type="text" placeholder="Alias"/>

          <Select name="ruleset.ref">
            <RulesetOptions />
          </Select>

          <Select name="parent.ref">
            <ContentTypeOptions/>
          </Select>

          <CustomFieldInput field="variables" onChange={formikProps.setFieldValue} values={formikProps.values}/>

          <Button type="button" onClick={() => formikProps.resetForm}>Reset</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
});

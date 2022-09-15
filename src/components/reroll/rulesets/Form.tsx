import { Button } from "@chakra-ui/react";
import { Input } from "@owl-factory/components/form";
import { Ruleset } from "@prisma/client";
import { Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { CustomFieldInput } from "../forms/customFields/CustomFieldInput";

// The initial values of the form
const INITIAL_VALUES = {
  ref: "",
  name: "",
  alias: "",
  actorFields: {},
  actorTypes: [],
  staticVariables: {},
};

/**
 * Renders a form for creating or editing a ruleset
 * @param props.ruleset A pre-existing ruleset to edit
 */
export function RulesetForm(props: { ruleset?: Ruleset }) {
  const router = useRouter();
  const initialValues = props.ruleset || INITIAL_VALUES;
  if (!initialValues.actorFields) {
    initialValues.actorFields = {};
  }

  /**
   * Submits the form values to create or update a ruleset
   * @param values The ruleset values from the form
   */
  function onSubmit(values: Partial<Ruleset>) {
    return;
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<Partial<Ruleset>>) => (
        <Form>
          <Input name="name" type="text" label="Name"/>
          <Input name="alias" type="text" label="Alias"/>

          {/* <ActorTypeInput
            actorTypes={formikProps.values.actorTypes || []}
            setActorTypes={(actorTypes: ActorType[]) => formikProps.setFieldValue("actorTypes", actorTypes)}
          /> */}
          <hr/>

          <CustomFieldInput field="actorFields" onChange={formikProps.setFieldValue} values={formikProps.values}/>
          {/* <StaticVariableInput
            variables={formikProps.values.rules || { metadata: {}, values: {} }}
            setVariables={(rules) => formikProps.setFieldValue("rules", rules)}
          /> */}
          <Button type="button" onClick={() => formikProps.resetForm}>Reset</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
}



import { Button } from "@chakra-ui/react";
import { Input } from "@owl-factory/components/form";
import { ServerResponse } from "@owl-factory/https";
import { Ruleset } from "@prisma/client";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import React from "react";
import { CustomFieldInput } from "../forms/customFields/CustomFieldInput";

// The initial values of the form
const INITIAL_VALUES = {
  name: "",
  alias: "",
};

interface RulesetFormProps {
  ruleset?: Ruleset;
  onSubmit: (values: Partial<Ruleset>) => Promise<ServerResponse<{ ruleset: Ruleset }>>;
}

/**
 * Renders a form for creating or editing a ruleset
 * @param props.ruleset A pre-existing ruleset to edit
 */
export function RulesetForm(props: RulesetFormProps) {
  const initialValues = props.ruleset || INITIAL_VALUES;
  

  /**
   * Submits the form values to create or update a ruleset
   * @param values The ruleset values from the form
   */
  async function onSubmit(values: Partial<Ruleset>, formikHelpers: FormikHelpers<Partial<Ruleset>>) {
    const result = await props.onSubmit(values);
    if (result.success) { return; }

    formikHelpers.setErrors(result.errors);
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<Partial<Ruleset>>) => (
        <Form>
          <label>Name</label>
          <Input name="name" type="text" label="Name"/>
          <label>Alias</label>
          <Input name="alias" type="text" label="Alias"/>

          {/* <ActorTypeInput
            actorTypes={formikProps.values.actorTypes || []}
            setActorTypes={(actorTypes: ActorType[]) => formikProps.setFieldValue("actorTypes", actorTypes)}
          /> */}
          <hr/>

          {/* <CustomFieldInput field="actorFields" onChange={formikProps.setFieldValue} values={formikProps.values}/> 
          */}
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



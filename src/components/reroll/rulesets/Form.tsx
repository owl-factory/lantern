import { Button } from "@owl-factory/components/button";
import { Input } from "@owl-factory/components/form";
import { RulesetData } from "controllers/data/RulesetData";
import { Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { ActorType, RulesetDocument } from "types/documents";
import { CustomFieldInput } from "../forms/customFields/CustomFieldInput";
import { StaticVariableInput } from "../forms/staticVariables/StaticVariableInput";
import { ActorTypeInput } from "./ActorTypeInput";

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
export function RulesetForm(props: { ruleset?: Partial<RulesetDocument> }) {
  const router = useRouter();
  const initialValues = props.ruleset || INITIAL_VALUES;
  if (!initialValues.actorFields) {
    initialValues.actorFields = {};
  }

  if (props.ruleset && !RulesetData.isLoaded(props.ruleset.ref)) {
    return <></>;
  }

  /**
   * Submits the form values to create or update a ruleset
   * @param values The ruleset values from the form
   */
  function onSubmit(values: Partial<RulesetDocument>) {
    try {
      if (values.ref) { RulesetData.update(values).then(() => router.push(`/dev/rulesets`)); }
      else { RulesetData.create(values).then(() => router.push(`/dev/rulesets`)); }

    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<Partial<RulesetDocument>>) => (
        <Form>
          <Input name="name" type="text" label="Name"/>
          <Input name="alias" type="text" label="Alias"/>

          <ActorTypeInput
            actorTypes={formikProps.values.actorTypes || []}
            setActorTypes={(actorTypes: ActorType[]) => formikProps.setFieldValue("actorTypes", actorTypes)}
          />
          <hr/>

          <CustomFieldInput field="actorFields" onChange={formikProps.setFieldValue} values={formikProps.values}/>
          <StaticVariableInput
            variables={formikProps.values.rules || { metadata: {}, values: {} }}
            setVariables={(rules) => formikProps.setFieldValue("rules", rules)}
          />
          <Button type="button" onClick={() => formikProps.resetForm}>Reset</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
}



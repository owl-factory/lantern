import { Button } from "@owl-factory/components/button";
import { Input } from "@owl-factory/components/form";
import { rest } from "@owl-factory/https";
import { Ruleset } from "@prisma/client";
import { Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import React from "react";

// The initial values of the form
const INITIAL_VALUES = {
  name: "",
  alias: "",
};

interface RulesetFormProps {
  submitTo: string;
  ruleset?: Partial<Ruleset>;
  postSubmit: () => void;
}

/**
 * Renders a form for creating or editing a ruleset
 * @param props.ruleset A pre-existing ruleset to edit
 */
export function RulesetForm(props: RulesetFormProps) {
  const router = useRouter();
  const initialValues = props.ruleset || INITIAL_VALUES;

  /**
   * Submits the form values to create or update a ruleset
   * @param values The ruleset values from the form
   */
  async function onSubmit(values: Partial<Ruleset>) {
    try {
      let res;
      if (props.ruleset) { res = await rest.patch(props.submitTo, { ruleset: values }); }
      else { res = await rest.put(props.submitTo, { ruleset: values }); }
      props.postSubmit();
    } catch (e) {
      console.error(e);
    }
    
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
          />
          <hr/> */}

          {/*<CustomFieldInput field="actorFields" onChange={formikProps.setFieldValue} values={formikProps.values}/>*/}
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



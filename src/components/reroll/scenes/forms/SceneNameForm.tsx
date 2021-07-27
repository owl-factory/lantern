import { Input } from "components/design";
import { Form as FormikForm, Formik, FormikProps } from "formik";
import React from "react";

export function SceneNameForm({ controller }: any): JSX.Element {
  function onChange(event: any, props: FormikProps<unknown>) {
    props.handleChange(event);
    props.handleSubmit(event);
  }

  function onSubmit(values: any) {
    controller.setName(values.name);
  }

  return (
    <Formik
      initialValues={{
        name: controller.getName(),
      }}
      onSubmit={onSubmit}
    >
      { (props: any) => (
          <FormikForm>
            <Input onChange={(event) => onChange(event, props)}  name="name"/>
          </FormikForm>
        )}

    </Formik>
  );
}

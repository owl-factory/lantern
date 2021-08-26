import React from "react";
import { ErrorMessage, Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { signIn } from "utilities/auth";
import { Input } from "components/design";
import { Button } from "components/style";

/** Initial form values */
const initialValues = {
  username: "",
  password: "",
};

/** Validation for the login form */
const validationSchema = Yup.object({
  username: Yup.string()
    .required("Required"),
  password: Yup.string()
    .required("Required"),
});

/**
 * Renders the form for logging in
 */
export function SignInForm(): JSX.Element {

  /**
   * Submits the form on successful validation
   * @param values The form values
   */
  function submit(values: {username: string, password: string}) {
    signIn(values.username, values.password);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submit}
    >
      <FormikForm>
        <label>Username or email address</label>
        <Input type="text" aria-label="Username or email address" name="username"/>
        <ErrorMessage name="username"/>

        <label>Password</label>
        <Input type="password" aria-label="Password" name="password"/>
        <ErrorMessage name="password"/>

        <Button type="submit">Submit</Button>
      </FormikForm>
    </Formik>
  );
}
export default SignInForm;

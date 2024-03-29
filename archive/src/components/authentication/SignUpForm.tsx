import React from "react";
import { ErrorMessage, Formik, Form as FormikForm } from "formik";
import { signUp } from "utilities/auth";
import { signUpValidationSchema } from "utilities/validation/users/signup";
import { Button } from "@chakra-ui/react";
import { Input } from "components/form";

/** Initial form values */
const initialValues = {
  username: "",
  email: "",
  password: "",
};

/**
 * Renders the form for logging in
 */
export function SignUpForm(): JSX.Element {

  /**
   * Submits the form on successful validation
   * @param values The form values
   */
  function submit(values: {username: string, email: string, password: string}) {
    signUp(values.username, values.email, values.password);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signUpValidationSchema}
      onSubmit={submit}
    >
      <FormikForm>
        <label>Username</label>
        <Input type="text" aria-label="Username" name="username"/>
        <ErrorMessage name="username"/>

        <label>Email</label>
        <Input type="text" aria-label="Email" name="email"/>
        <ErrorMessage name="email"/>

        <label>Password</label>
        <Input type="password" aria-label="Password" name="password"/>
        <ErrorMessage name="password"/>

        <Button type="submit">Submit</Button>
      </FormikForm>
    </Formik>
  );
}
export default SignUpForm;

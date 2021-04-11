import React from "react";
import { ErrorMessage, Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { Button, Col, Form, Row } from "react-bootstrap";
import { signUp } from "utilities/auth";
import { Input } from "components/design";

/** Initial form values */
const initialValues = {
  username: "",
  email: "",
  password: "",
};

/** Validation for the login form */
const validationSchema = Yup.object({
  username: Yup.string()
    .required("Required"),
  email: Yup.string()
    .required("Required"),
  password: Yup.string()
    .required("Required"),
});

/**
 * Renders the form for logging in
 */
export default function SignUpForm(): JSX.Element {

  /**
   * Submits the form on successful validation
   * @param values The form values
   */
  function submit(values: {username: string, email: string, password: string}) {
    signUp(values.username, values.email, values.password, (res) => {console.log(res);});
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submit}
    >
      <FormikForm>
        <Row>
          <Form.Group as={Col} sm={12}>
            <Form.Label>Username</Form.Label>
            <Input type="text" aria-label="Username" name="username"/>
            <ErrorMessage name="username"/>
          </Form.Group>
          <Form.Group as={Col} sm={12}>
            <Form.Label>Email</Form.Label>
            <Input type="text" aria-label="Email" name="email"/>
            <ErrorMessage name="email"/>
          </Form.Group>
          <Form.Group as={Col} sm={12}>
            <Form.Label>Password</Form.Label>
            <Input type="password" aria-label="Password" name="password"/>
            <ErrorMessage name="password"/>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col}>
            <Button type="submit">Submit</Button>
          </Form.Group>
        </Row>
      </FormikForm>
    </Formik>
  );
}

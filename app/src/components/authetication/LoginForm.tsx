import React from "react";
import { Formik, Form as FormikForm, ErrorMessage, } from "formik";
import * as Yup from "yup";
import { Col, Form, Row, Button } from "react-bootstrap";
import { Input } from "../design/forms/Forms";

/** Initial form values */
const initialValues = {
  email: "",
  password: ""
}

/** Validation for the login form */
const validationSchema = Yup.object({
  email: Yup.string()
    .required("Required"),
  password: Yup.string()
    .required("Required"),
});

/**
 * Renders the form for logging in
 */
export default function LoginForm(): JSX.Element {

  /**
   * Submits the form on successful validation
   * @param values The form values
   */

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={() => {return}}
    >
      <FormikForm>
        <Row>
          <Form.Group as={Col} sm={12}>
            <Form.Label>Email</Form.Label>
            <Input aria-label="Email" name="email"/>
            <ErrorMessage name="email"/>
          </Form.Group>

          <Form.Group as={Col} sm={12}>
            <Form.Label>Password</Form.Label>
            <Input type="password" aria-label="Password" name="password"/>
            <ErrorMessage name="password"/>
          </Form.Group>
        </Row>
        <Row>
          <Col>
            {/* {errorMessage} */}
          </Col>
        </Row>
        <Row>
          <Form.Group as={Col}>
            <Button type="submit">Submit</Button>
          </Form.Group>
        </Row>
      </FormikForm>
    </Formik>
  )
}
import React from "react";
import { Formik, Form as FormikForm, ErrorMessage, } from "formik";
import * as Yup from "yup";
import { emailLogin } from "../../utilities/auth";
import { useRouter } from "next/router";
import { Col, Form, Row, Button } from "react-bootstrap";
import { Input } from "../design/forms/Forms";

interface LoginValues {
  email: string;
  password: string;
}

const initialValues = {
  email: "",
  password: ""
}

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Required"),
  password: Yup.string()
    .required("Required"),
});

export default function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = React.useState("");

  /**
   * Submits the form on successful validation
   * @param values The form values
   */
  function onSubmit(values: LoginValues) {
    emailLogin(values.email, values.password)
    .then((loginResult) => {
      if ("error" in loginResult) {
        setErrorMessage(loginResult["error"]);
        return;
      }
      
      router.reload();
    });
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
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
            {errorMessage}
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
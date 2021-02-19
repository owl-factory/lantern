import { Formik, Form as FormikForm } from "formik";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";
import { ErrorMessage, Input, TextArea } from "../../design/forms/Forms";
import { FormixFormProps } from "../../../types/design/form";
import { CommonContentType } from "../../../types/documents";


/**
 * Renders the game system form with functionality for new and existing game systems
 * @param initialValues The initial values of the form
 * @param onSubmit The action to run on submit
 * @param themes An array of themes for a selection
 */
export default function CommonContentTypeForm(props: FormixFormProps<CommonContentType>): JSX.Element {
  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      validationSchema={Yup.object({
        name: Yup.string()
          .required("Required")
          .max(100, "Maximum of 100 characters"),
        alias: Yup.string()
          .max(20, "Maximum of 20 characters"),
        description: Yup.string()
          .max(1000, "Maximum of 1000 characters"),
      })}
    >
      {() => (
        <FormikForm>
          <Row>
            {/* Gamesystem Name */}
            <Form.Group as={Col}>
              <Form.Label>Common Content Type</Form.Label>
              <Input name="name" />
              <ErrorMessage name="name"/>
            </Form.Group>

            {/* URL Key */}
            <Form.Group as={Col}>
              <Form.Label>URL Alias</Form.Label>
              <Input name="alias"/>
              <ErrorMessage name="alias"/>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col}>
              {/* Description */}
              <Form.Label>Description</Form.Label>
              <TextArea name="description" />
              <ErrorMessage name="description"/>
            </Form.Group>

          </Row>

          <Button variant="primary" type="submit">Save</Button>
        </FormikForm>
      )}
    </Formik>
  );
}

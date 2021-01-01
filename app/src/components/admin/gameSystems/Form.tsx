import { Formik, Form as FormikForm } from "formik";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";
import { Error, Input, TextArea } from "../../design/forms/Forms";
import { FormixFormProps } from "../../../model/design/form";
import { GameSystem } from "@reroll/model/dist/documents";

/**
 * Renders the game system form with functionality for new and existing game systems
 * @param errors The errors
 * @param initialValues The initial values of the form
 * @param onSubmit The action to run on submit
 * @param themes An array of themes for a selection
 */
export default function GameSystemForm(props: FormixFormProps<GameSystem>): JSX.Element {
  return (
    <Formik
      initialErrors={props.errors}
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
          <Error name="_global"/>

          <Row>
            {/* Gamesystem Name */}
            <Form.Group as={Col}>
              <Form.Label>Game System Name</Form.Label>
              <Input name="name" />
              <Error name="name"/>
            </Form.Group>

            {/* URL Key */}
            <Form.Group as={Col}>
              <Form.Label>URL Alias</Form.Label>
              <Input name="alias"/>
              <Error name="alias"/>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col}>
              {/* Description */}
              <Form.Label>Description</Form.Label>
              <TextArea name="description" />
              <Error name="description"/>
            </Form.Group>
          </Row>

          <Button variant="primary" type="submit">Submit!</Button>
        </FormikForm>
      )}
    </Formik>
  );
}

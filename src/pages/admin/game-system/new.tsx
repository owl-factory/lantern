import { Formik, Form as FormikForm } from "formik";
import React from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import * as Yup from "yup";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import { Input } from "../../../components/design/forms/Forms";
import Page from "../../../components/design/Page";

/**
 * Renders a form for creating a new gamesystem
 */
export function NewGameSystemForm() {
  return (
    <Formik
      initialValues={{name: {}}}
      validationSchema={Yup.object({})}
      onSubmit={(values: any) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {(props: any) => (
        <FormikForm>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Test</Form.Label>
              <InputGroup>
                <Input name="name.nested" label="System Name"/>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col}>
            <Form.Label>Second Test</Form.Label>
              <Input name="name.nested" label="System Name"/>
            </Form.Group>
          </Row>

          <Button variant="primary" type="submit">Submit!</Button>
        </FormikForm>
      )} 
    </Formik>
  );
}

/**
 * Renders a the page to create a new game system
 */
function NewGameSystem() {
  return (
    <Page>
      <h1>New Game Systems</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", "New Game System"]}/>

      <br/>

      <NewGameSystemForm/>
    </Page>
  );
}

export default NewGameSystem;

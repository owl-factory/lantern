import React from "react";
import { Input, Select, TextArea} from "../components/design/forms/Forms";
import Page from "../components/design/Page";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";

/**
 * Renders the Bug Report page
 */
function BugReport() {
  return (
    <Page>
      <Card>
        <Card.Body>
          <h4>
            Report a Bug
          </h4>

          <p>
            Something break? Encounter an error? Let us know!
          </p>

          <BugReportForm/>
        </Card.Body>
      </Card>
    </Page>
  );
}

/**
 * Renders the bug report form
 */
function BugReportForm() {
  const bugOptions = [
    {name: "Render Issue", value: "Render Issue"},
    {name: "Loss of data", value: "Loss of Data"},
  ];

  return (
    <Formik
      initialValues={{}}
      validationSchema={Yup.object({})}
      onSubmit={(values: any) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {(props: any) => 
        <FormikForm>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Email</Form.Label>
              <Input name="Email"/>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Bug Type</Form.Label>
              <Select name="bugType" options={bugOptions} labelKey="name"/>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col}>
              <Form.Label>Message</Form.Label>
              <TextArea id="message" label="What Happened?" name="What Happened?"/>              
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col}>
              <Button variant="primary" type="submit">Submit</Button>
            </Form.Group>
          </Row>
        </FormikForm>
      }
    </Formik>
  );
}

export default BugReport;

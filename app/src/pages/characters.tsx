import React from "react";
import Page from "../components/design/Page";
import { Formik, Form as FormikForm } from "formik";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Input } from "../components/design/forms/Input";
import { CharacterInput } from "@reroll/model/dist/inputs/CharacterInput";


export default function Characters() {
  const [characters, setCharacters] = React.useState([]);

  function submit(values: CharacterInput) {

  }

  return (
    <Page>
      <Formik
        initialValues={{}}
        onSubmit={(values: CharacterInput) => {
          submit(values)
          alert(JSON.stringify(values, null, 2));
        }}
      >
        {(props: any) => 
          <FormikForm>
            <Row>
              <Form.Group as={Col}>
                <Input name="name"/>
                <Form.Label>Character Name</Form.Label>
              </Form.Group>

              <Form.Group as={Col}>
                <Button variant="primary" type="submit">Submit</Button>
              </Form.Group>
            </Row>
          </FormikForm>
        }
      </Formik>
    </Page>
  );
}
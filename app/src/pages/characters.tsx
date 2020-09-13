import React from "react";
import Page from "../components/design/Page";
import { Formik, Form as FormikForm } from "formik";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Input } from "../components/design/forms/Input";
import { CharacterInput } from "@reroll/model/dist/inputs/CharacterInput";
import gql from "graphql-tag";
import { client } from "../utilities/graphql/apiClient";

export default function Characters() {
  const [characters, setCharacters] = React.useState([]);

  async function submit(values: any) {
    let filters = `filters: {`;

    if (values.name_like) {
      filters += `name_like: "${values.name_like}"`;
    }

    filters += "}";

    const query = gql`
      query {
        characters (${filters}) {
          _id,
          name
        }
      }
    `;
    
    client.query({query})
    .then((result: any) => {
      setCharacters(result.data.characters)
    })
    .catch((error) => {
      console.log(error)
    })
    
  }

  return (
    <Page>
      <Formik
        initialValues={{}}
        onSubmit={(values: CharacterInput) => {
          submit(values)
        }}
      >
        {(props: any) => 
          <FormikForm>
            <Row>
              <Form.Group as={Col}>
                <Input name="name_like"/>
                <Form.Label>Character Name</Form.Label>
              </Form.Group>

              <Form.Group as={Col}>
                <Button variant="primary" type="submit">Submit</Button>
              </Form.Group>
            </Row>
          </FormikForm>
        }
      </Formik>

      {JSON.stringify(characters)}
    </Page>
  );
}
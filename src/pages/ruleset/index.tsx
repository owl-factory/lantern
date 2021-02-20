import { Formik, Form } from "formik";
import React from "react";
import { Button, Card, Col, FormGroup, FormLabel, Row } from "react-bootstrap";
import Modal from "../../components/design/Modal";
import Page from "../../components/design/Page";
// import * as Yup from "yup";
import { ErrorMessage, Input, Select } from "../../components/design/forms/Forms";
import request from "../../utilities/request";


/**
 * Renders the form to create a new game system.
 */
function CreateRulesetForm() {
  const [ errors, setErrors ] = React.useState({name: "Oh hai error"});

  /**
   * Runs the submit action of the create game system form and handles
   * the success and failure results
   * @param values The values from the form to submit
   */
  async function onSubmit(values: Record<string, string>) {
    const response = await request.post(
      "/api/rule-systems",
      values
    );
    console.log(response)
  }

  return (
    <Formik
      initialErrors={ errors }
      initialValues={ {} }
      onSubmit={onSubmit}
      // validationSchema={Yup.object({
      //   name: Yup.string()
      //     .required("Required")
      //     .max(100, "Maximum of 100 characters"),
      //   alias: Yup.string()
      //     .max(20, "Maximum of 20 characters"),
      // })}
    >
      {() => (
        <Form>
          {/* Just name for now */}
          <Row>
            <FormGroup as={Col} xs={12} lg={6}>
              <FormLabel>Ruleset Name</FormLabel>
              <Input name="name"/>
              <ErrorMessage name="name"/>
            </FormGroup>
          </Row>

          <Button type="submit">Submit!</Button>
        </Form>
      )}
    </Formik>
  );
}

function RulesetModal(props: any) {
  return (
    <Modal open={props.modal} handleClose={props.handleClose}>
      <Card>
        <Card.Header>Create a New Game System</Card.Header>
        <Card.Body>
          <CreateRulesetForm/>
        </Card.Body>
      </Card>
    </Modal>
  );
}

export default function Rulesets(props: any) {
  const [modal, setModal] = React.useState(false);
  function handleClose() { setModal(false); }

  return (
    <Page>
      {/* Create Ruleset */}
      <Button onClick={() => { setModal(true); }}>New Ruleset</Button>
      <RulesetModal modal={modal} handleClose={handleClose}/>
      {/* Search & Filters */}
      {/* Table */}
    </Page>
  );
}

Rulesets.getInitialProps = async () => {
  const res = await request.get("/api/rule-systems");

  return res;
};

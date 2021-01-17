import { Formik, Form } from "formik";
import React from "react";
import { Button, Card, Col, FormGroup, FormLabel, Row } from "react-bootstrap";
import Modal from "../../components/design/Modal";
import Page from "../../components/design/Page";
// import * as Yup from "yup";
import { ErrorMessage, Input, Select } from "../../components/design/forms/Forms";
import request from "../../utilities/request";



function CreateGameSystemForm(props: any) {
  const [ errors, setErrors ] = React.useState({name: "Oh hai error"});

  function onSubmit(values: Record<string, string>) {
    const response = request.post(
      "/api/game-system",
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
          {/* Name, Publish Level, Organization, description */}
          <Row>
            <FormGroup as={Col} xs={12} lg={6}>
              <FormLabel>Game System Name</FormLabel>
              <Input name="name"/>
              <ErrorMessage name="name"/>
            </FormGroup>
            {/* <Select name="publishLevel"/>
            <Select name="organization"/> */}
          </Row>

          <Button type="submit">Submit!</Button>
        </Form>
      )}
    </Formik>
  )
}

function GameSystemModal(props: any) {
  return (
    <Modal open={props.modal} handleClose={props.handleClose}>
      <Card>
        <Card.Header>Create a New Game System</Card.Header>
        <Card.Body>
          <CreateGameSystemForm/>
        </Card.Body>
      </Card>
    </Modal>
  )
}

export default function GameSystems(props: any) {
  const [modal, setModal] = React.useState(false);
  function handleClose() { setModal(false); }

  return (
    <Page>
      {/* Create Gamesystem */}
      <Button onClick={() => { setModal(true) }}>New Game System</Button>
      <GameSystemModal modal={modal} handleClose={handleClose}/>
      {/* Search & Filters */}
      {/* Table */}
    </Page>
  );
}

GameSystems.getInitialProps = async () => {
  const res = await request.get("/api/game-systems");

  return res;
}
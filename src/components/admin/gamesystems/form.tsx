import React from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { AutoForm, Checkbox, Input, Select, TextArea } from "../../../components/design/forms/Forms";
import { defState } from "../../../helpers/tools";

function loadThemes() {
  // TODO - use an actual graphql call
  return [];
}

function renderCost(isPurchasable: any) {
  console.log(isPurchasable);
  if(isPurchasable === true) {
    return (
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Cost</Form.Label>
          <Input type="number" name="cost" />
        </Form.Group>
      </Row>
    );
  }
}

export default function GamesystemForm(props: any) {
  const [data, setData] = defState(props.state, props.setState, {
    id: "",
    name: "",
    key: "",
    description: "",
    isPurchasable: false,
    cost: 0.00,
    theme: null,
  });

  const [formState, setFormState] = defState(props.formState, props.setFormState, {});

  const errors = {
    checkboxText: "Error!",
    name: "Name error",
    radioTest: "radioTest error",
    selectTest: "Select errors",
  };

  const themes = loadThemes();

  return (
    <AutoForm data={data} setData={setData} formState={formState} setFormState={setFormState} errors={errors}>
      <Row>
        {/* Gamesystem Name */}
        <Form.Group as={Col}>
          <Form.Label>Gamesystem Name</Form.Label>
          <Input name="name" />
        </Form.Group>

        {/* URL Key */}
        <Form.Group as={Col}>
          <Form.Label>URL Key</Form.Label>
          <Input name="key" />
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col}>
          {/* Description */}
          <Form.Label>Description</Form.Label>
          <TextArea name="description" />
        </Form.Group>

        <Col>
            {/* Default Theme */}
            <Row>
            <Form.Group as={Col}>
            <Form.Label>Default Theme</Form.Label>
              <Select name="themeID" options={themes}/>
            </Form.Group>
          </Row>

          <Row>
            {/* Is Purchasable */}
            <Form.Group as={Col}>
              <Checkbox name="isPurchasable" label="Purchasable?" />
            </Form.Group>
          </Row>

          {renderCost(data.isPurchasable)}
        </Col>
        
      </Row>

      <Button variant="primary" onClick={props.submit(data)}>Submit!</Button>
    </AutoForm> 
  );
}
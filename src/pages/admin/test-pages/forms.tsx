import React from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import {
  BaseCheckbox,
  Checkbox,
  Date,
  DateTime,
  AutoForm,
  Input,
  Multiselect,
  RadioButtons,
  // Section,
  Select,
  TextArea,
  Time,
} from "../../../components/design/forms/Forms";
import Page from "../../../components/design/Page";
import { defState } from "../../../helpers/tools";

export function TestForm(props: any) {
  const [data, setData] = defState(props.state, props.setState, {
    name: {nameAgain: "Boop"},
    key: "",
  });

  const [formState, setFormState] = defState(props.formState, props.setFormState, {});

  const selectData = [
    {label: "Dungeons and Dragons 5th Edition", value: "dnd-5e"},
    {label: "Pathfinder 2", value: "pathfinder2"},
    {label: "Rainbows", value: "rainbows"},
  ];

  const checkboxData = [
    {label: "Dungeons and Dragons 5th Edition", name: "dnd-5e", defaultValue: false},
    {label: "Pathfinder 2", name: "pathfinder2", defaultValue: true},
    {label: "Rainbows", name: "rainbows", defaultValue: false},
  ];

  const errors = {
    checkboxText: "Error!",
    name: "Name error",
    radioTest: "radioTest error",
    selectTest: "Select errors",

  };

  return (
    <AutoForm data={data} setData={setData} formState={formState} setFormState={setFormState} errors={errors}>
      <h2>Text Inputs</h2>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Test</Form.Label>
          <InputGroup>
            <Input name="name.nameAgain" label="System Name" required={true} defaultValue="Test"/>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
        <Form.Label>Second Test</Form.Label>
          <Input name="name.nameAgain" label="System Name" required={true} defaultValue="Test"/>
        </Form.Group>
      </Row>

      <h2>Select Inputs</h2>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Select Test</Form.Label>
          <Select name="selectTest" label="Select Test"  options={selectData} defaultValue="rainbows"/>
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Select Test 2</Form.Label>
          <Select name="selectTest" label="Select Test"  options={selectData} defaultValue="rainbows"/>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col}>
          <Multiselect name="selectTest2" label="Multiselect Test" options={selectData}/>
        </Form.Group>

        <Form.Group as={Col}>
          <Multiselect name="selectTest2" label="Multiselect Test" options={selectData} defaultValue={[]}/>
        </Form.Group>
      </Row>

      <h2>Checkboxes</h2>
      <Row>
        <Form.Group as={Col}>
          <Checkbox name="checkboxText" label="Checkbox Test v1" />
          <Checkbox name="checkboxText" label="Matching Checkbox" />

        </Form.Group>

        <Form.Group as={Col}>
          {/* <Checkboxes id="checkboxText" options={checkboxData}/> */}

        </Form.Group>
      </Row>

      <h2>Radio Buttoms</h2>
      <RadioButtons name="radioTest" label="Radio Test"  data={selectData} defaultValue="rainbows"/>
      
      <Date name="date" label="Date Test"/>
      <DateTime name="datetime" label="Date Time Test"/>
      
      <Time name="time" label="Time Test"/>
      <TextArea name="textarea" rows={2} label="Text Area"/>
      
      <Button variant="primary">Submit!</Button>  
    </AutoForm>
  );
}

/**
 * Renders a the page to create a new game system
 */
function TestForms() {

  return (
    <Page>
      <h1>Test Forms</h1>

      <br/>

      <TestForm/>
    </Page>
  );
}

export default TestForms;

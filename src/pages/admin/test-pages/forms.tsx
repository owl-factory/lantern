import React from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import {
  BaseCheckbox,
  BaseRadioButton,
  BaseSwitch,
  Checkbox,
  Date,
  DateTime,
  AutoForm,
  Input,
  Multiselect,
  RadioButton,
  Select,
  Switch,
  TextArea,
  Time,
} from "../../../components/design/forms/Forms";
import Page from "../../../components/design/Page";
import { defState } from "../../../helpers/tools";

export function TestForm(props: any) {
  const [data, setData] = defState(props.state, props.setState, {
    name: {nameAgain: "Boop"},
    key: "",
    radioButtonTest: "Thing"
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
          <BaseCheckbox name="basecheckboxText">
            <Form.Check.Label>Base Checkbox Text</Form.Check.Label>
          </BaseCheckbox>
        
          <BaseCheckbox name="basecheckboxText">
            <Form.Check.Label>Matching Checkbox</Form.Check.Label>
          </BaseCheckbox>
        </Form.Group>
      </Row>

      <h2>Radio Buttons</h2>
      <Row>
        <Form.Group as={Col}>
          <RadioButton id="1" name="radioButtonTest" label="Radio Button Test v1" value="Thing"/>
          <RadioButton id="2" name="radioButtonTest" label="Another Radio Button" value="Thing2"/>
        </Form.Group>

        <Form.Group as={Col}>
          <BaseRadioButton id="base1" name="basecheckboxText" value="boopp">
            <Form.Check.Label>Base Checkbox Text</Form.Check.Label>
          </BaseRadioButton>
        
          <BaseRadioButton id="base2" name="basecheckboxText" value="boop2">
            <Form.Check.Label>Matching Checkbox</Form.Check.Label>
          </BaseRadioButton>
        </Form.Group>
      </Row>

      <h2>Switches</h2>
      <Row>
        <Form.Group as={Col}>
          <Switch id="swtich1" name="switchtest" label="Radio Button Test v1"/>
          <Switch id="swtich2" name="switchtest" label="Another Radio Button"/>
        </Form.Group>

        {/* TODO - this doesn't work */}
        <Form.Group as={Col}>
          <BaseSwitch name="baseswitchText">
            <Form.Check.Label>Base Checkbox Text</Form.Check.Label>
          </BaseSwitch>
        
          <BaseSwitch name="baseswitchText2">
            <Form.Check.Label>Matching Checkbox</Form.Check.Label>
          </BaseSwitch>
        </Form.Group>
      </Row>
      
      <h2>Dates</h2>
      <Row>
        <Form.Group as={Col}>
          <Date name="dateTest" label="Date Test" />
        </Form.Group>

        <Form.Group as={Col}>
          <Date name="dateTest" label="Date Test" />
        </Form.Group>
      </Row>

      <h2>Date Time</h2>
      <Row>
        <Form.Group as={Col}>
          <DateTime name="datetime" label="Date Time Test"/>
        </Form.Group>

        <Form.Group as={Col}>
          <DateTime name="datetime" label="Date Time Test"/>
        </Form.Group>
      </Row>

      <h2>Time</h2>
      <Row>
        <Form.Group as={Col}>
          <Time name="time" label="Time Test"/>
        </Form.Group>

        <Form.Group as={Col}>
          <Time name="time" label="Time Test"/>
        </Form.Group>
      </Row>

      <h2>TextArea</h2>
      <Row>
        <Form.Group as={Col}>
          <TextArea name="textarea" rows={2} label="Text Area"/>
        </Form.Group>

        <Form.Group as={Col}>
          <TextArea name="textarea" rows={2} label="Text Area"/>
        </Form.Group>
      </Row>

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

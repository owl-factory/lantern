import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import {
  Checkboxes,
  Date,
  DateTime,
  Form,
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

export function NewGameSystemForm(props: any) {
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
    <Form data={data} setData={setData} formState={formState} setFormState={setFormState} errors={errors}>
<<<<<<< Updated upstream
      <Input name="name.nameAgain" label="System Name" required={true} defaultValue="Test"/>
      <Input name="key" label="System Key" required={true} defaultValue={data.key}/>
=======
      <Row>
        <Col>
          <Input prepend={<Button variant="outline-secondary">Button</Button>} name="name.nameAgain" label="System Name" required={true} defaultValue="Test" message="Hello"/>
        </Col>
        <Col>
          <Input prepend={<Button variant="outline-secondary">Button</Button>} name="name.nameAgain" label="System Name" required={true} defaultValue="Test" message="Hello"/>
        </Col>

      </Row>
      {/* <Input name="key" label="System Key" required={true} defaultValue={data.key}/>
      
>>>>>>> Stashed changes
      <Select name="selectTest" label="Select Test"  data={selectData} defaultValue="rainbows"/>
      <Multiselect name="selectTest2" label="Multiselect Test" data={selectData} defaultValue={[]}/>
      
      <Checkboxes id="checkboxText" label="Checkbox Test" data={checkboxData}/>
      <RadioButtons name="radioTest" label="Radio Test"  data={selectData} defaultValue="rainbows"/>
      
      <Date name="date" label="Date Test"/>
      <DateTime name="datetime" label="Date Time Test"/>
      
      <Time name="time" label="Time Test"/>
      <TextArea name="textarea" rows={2} label="Text Area"/>
      
      <Section>
        <Input name="name.nameAgain" label="System Name" required={true} defaultValue="Test"/>
        <Input name="key" label="System Key" required={true} defaultValue={data.key}/>
      </Section>
      <Button variant="primary">Submit!</Button>   */}
    </Form>
  );
}

/**
 * Renders a the page to create a new game system
 */
function NewGameSystem() {

  return (
    <Page>
      <MuiContainer fixed>
        <h1>New Game Systems</h1>
        <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", "New Game System"]}/>

        <br/>

        <NewGameSystemForm/>
      </MuiContainer>
    </Page>
  );
}

export default NewGameSystem;

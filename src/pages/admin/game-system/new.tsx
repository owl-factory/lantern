import { Grid, Typography } from "@material-ui/core";
import react from "react";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import { Checkboxes, Form, Input, RadioButtons, Select } from "../../../components/design/Forms";
import Page from "../../../components/Page";

export function NewGameSystemForm() {
  const [form, setForm] = react.useState({
    name: "Boop",
    key: "",
  });

  const selectData = [
    {label: "Dungeons and Dragons 5th Edition", value: "dnd-5e"},
    {label: "Pathfinder 2", value: "pathfinder2"},
    {label: "Rainbows", value: "rainbows"},
  ];

  return (
    <Form>
      <Input id="name" label="System Name" required={true} defaultValue="Test"/>
      <Input id="key" label="System Key" required={true} defaultValue={form.key}/>
      <Select id="selectTest" label="Select Test"  data={selectData} defaultValue="rainbows"/>
      <Checkboxes id="checkboxTest" label="Checkbox Test"></Checkboxes>
      <RadioButtons id="radioTest" label="Radio Test"  data={selectData} defaultValue="rainbows"/>

    </Form>
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

      <NewGameSystemForm/>
    </Page>
  );
}

export default NewGameSystem;

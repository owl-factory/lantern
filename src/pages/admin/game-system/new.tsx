import { Grid, Typography } from "@material-ui/core";
import react from "react";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import { Form, Input } from "../../../components/design/Forms";
import Page from "../../../components/Page";

export function NewGameSystemForm() {
  const [form, setForm] = react.useState({
    name: "",
    key: "",
  });

  // TODO - move this function to the form and export it
  function onChange(event: object) {
    console.log(event)
  }

  return (
    <Form>
      <Grid item xs={12}><Typography variant="h5">Add a new Game System</Typography></Grid>
      <Input id="name" label="System Name" required={true} onChange={onChange} value={form.name}/>
      <Input id="key" label="System Key" required={true} onChange={onChange} value={form.key}/>
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

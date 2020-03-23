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

  return (
    <Form>
      <Input id="name" label="System Name" required={true} defaultValue={form.name}/>
      <Input id="key" label="System Key" required={true} defaultValue={form.key}/>
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

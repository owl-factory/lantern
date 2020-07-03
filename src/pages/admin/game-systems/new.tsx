import React from "react";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import GamesystemForm from "../../../components/admin/gameSystems/Form";
import Page from "../../../components/design/Page";

export function NewGamesystemForm() {
  return <GamesystemForm 
    initialValues={{
      name: "",
      key: "",
      description: "",
      isPurchasable: false,
      cost: 0.00,
      theme: null,
    }}
    onSubmit={(values: any) => alert(JSON.stringify(values))}
  />;
}

/**
 * Renders a the page to create a new game system
 */
function NewGamesystem() {
  return (
    <Page>
      <h1>Create Game System</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", "Create Game System"]}/>

      <br/>

      <NewGamesystemForm/>
    </Page>
  );
}

export default NewGamesystem;

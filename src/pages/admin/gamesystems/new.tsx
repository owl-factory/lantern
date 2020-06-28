import React from "react";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import GamesystemForm from "../../../components/admin/gamesystems/form";
import Page from "../../../components/design/Page";

export function NewGamesystemForm() {
  return <GamesystemForm />;
}

/**
 * Renders a the page to create a new game system
 */
function NewGamesystem() {
  function submitNewGamesystem(data: Gamesystem) {
    validateGamesystem() ? submitNewGamesystem() : return;

  }


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

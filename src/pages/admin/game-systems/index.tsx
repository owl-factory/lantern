import React from "react";
import { Button } from "react-bootstrap";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import registerModal from "../../../components/design/Modal";
import Table from "../../../components/design/tables/Table";
import Page from "../../../components/design/Page";
import gamesystemJson from "./gamesystems.json";
import { TableBuilder } from "../../../helpers/design/table";

/**
 * Renders the Admin Game Systems page
 */
function GameSystems() {
  const [NewGameSystemModal, openNewSystemModal] = registerModal();
  const tableBuilder = new TableBuilder()
    .addIncrementColumn("")
    .addDataColumn("Game System", "system")
    .addDataColumn("Content Count", "officialContentCount")
    .addDataColumn("Entity Count", "officialEntityCount")
    .addComponentColumn("Tools", (props: any) => (<></>));

  return (
    <Page>
      <h3>Game Systems</h3>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems"]}/>
      <Button onClick={openNewSystemModal} >+ Add Game System</Button>
      {/* <NewGameSystemModal dirty={true}>
        <h5 >Add a new Game System</h5>
        <NewGamesystemForm/>
      </NewGameSystemModal> */}
      <Table {...tableBuilder.renderConfig()} data={gamesystemJson}/>
    </Page>
  );
}

export default GameSystems;

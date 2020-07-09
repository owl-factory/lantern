import React from "react";
import { Button } from "react-bootstrap";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import Table from "../../../components/design/tables/Table";
import Page from "../../../components/design/Page";
import gamesystemJson from "./gamesystems.json";
import { TableBuilder } from "../../../helpers/design/table";
import Link from "next/link";

/**
 * Renders the Admin Game Systems page
 */
function GameSystems() {
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
      <Link href="/admin/game-systems/new"><Button >+ Add Game System</Button></Link>
      {/* <NewGameSystemModal dirty={true}>
        <h5 >Add a new Game System</h5>
        <NewGamesystemForm/>
      </NewGameSystemModal> */}
      <Table {...tableBuilder.renderConfig()} data={gamesystemJson}/>
    </Page>
  );
}

GameSystems.getInitialProps = async () => {
  // const { gamesystems } = await client.query({query: getGameSystemQuery(1)})
  return { gamesystems: gamesystemJson }
}

export default GameSystems;

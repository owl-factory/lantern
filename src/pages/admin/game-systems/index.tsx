/* eslint-disable react/display-name */
import React from "react";
import { Button } from "react-bootstrap";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import registerModal from "../../../components/design/Modal";
import Table from "../../../components/design/tables/Table";
import Page from "../../../components/design/Page";
import gamesystemJson from "./gamesystems.json";
import { TableBuilder } from "../../../helpers/design/table";
import gql from "graphql-tag";
import { client } from "../../../helpers/graphql";
import Link from "next/link";



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
      <Link href="/admin/game-systems/new" passHref>
        <Button >+ Add Game System</Button>
      </Link>
      {/* <Table /> */}
    </Page>
  );
}



function getGameSystemQuery(page: number) {
  // TODO - look at how to paginate
  const fetchThemesGQL = gql`
    {
      gamesystems (first: 10) {
        id,
        name,
      }
    }
  `;
  return fetchThemesGQL;
}

GameSystems.getInitialProps = async () => {
  // const { gamesystems } = await client.query({query: getGameSystemQuery(1)})
  return { gamesystems: gamesystemJson }
}

export default GameSystems;

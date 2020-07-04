/* eslint-disable react/display-name */
import React from "react";
import { Button } from "react-bootstrap";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import registerModal from "../../../components/design/Modal";
import Table, { ILayoutItem } from "../../../components/design/Table";
import Page from "../../../components/design/Page";
import gamesystemJson from "./gamesystems.json";
import gql from "graphql-tag";
import { client } from "../../../helpers/graphql";
import Link from "next/link";

// TODO - build this into a class
const tableLayout: ILayoutItem[] = [
  {
    title: "",
    component: (props: any) => <b>{props.content.id}</b>,
  },
  {
    title: "System",
    key: "system",
  },
  {
    title: "Content",
    key: "officialContentCount",
  },
  {
    title: "Entities",
    key: "officialEntityCount",
  },
  {
    title: "Tools",
    key: "Tools",
  },
];

/**
 * Renders the Admin Game Systems page
 */
function GameSystems() {

  return (
    <Page>
      <h3>Game Systems</h3>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems"]}/>
      <Link href="/admin/game-systems/new" passHref>
        <Button >+ Add Game System</Button>
      </Link>
      <Table layout={tableLayout} json={JSON.stringify(gamesystemJson)}/>
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

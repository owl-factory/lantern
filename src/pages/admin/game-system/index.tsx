import React from "react";
import { Button } from "react-bootstrap";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import registerModal from "../../../components/design/Modal";
import Table, { ILayoutItem } from "../../../components/design/Table";
import Page from "../../../components/design/Page";
import gamesystemJson from "./gamesystems.json";
import { NewGameSystemForm } from "./new";

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
  const [NewGameSystemModal, openNewSystemModal] = registerModal();

  return (
    <Page>
      <h3>Game Systems</h3>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems"]}/>
      <Button onClick={openNewSystemModal} >+ Add Game System</Button>
      <NewGameSystemModal dirty={true}>
        <h5 >Add a new Game System</h5>
        <NewGameSystemForm/>
      </NewGameSystemModal>
      <Table layout={tableLayout} json={JSON.stringify(gamesystemJson)}/>
    </Page>
  );
}

export default GameSystems;

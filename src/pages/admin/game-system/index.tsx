import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
// import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import registerModal from "../../../components/design/Modal";
import Table, { ILayoutItem } from "../../../components/design/Table";
import Page from "../../../components/Page";
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
      <h1>Game Systems</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems"]}/>
      <Button onClick={openNewSystemModal} >+ Add Game System</Button>
      <NewGameSystemModal>
        <NewGameSystemForm/>
      </NewGameSystemModal>
      <Table layout={tableLayout} json={JSON.stringify(gamesystemJson)}/>
    </Page>
  );
}

export default GameSystems;

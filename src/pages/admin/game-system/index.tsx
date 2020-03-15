import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
// import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import Modal from "../../../components/design/Modal";
import Table, { ILayoutItem } from "../../../components/design/Table";
import Page from "../../../components/Page";
import gamesystemJson from "./gamesystems.json";

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
      <h1>Game Systems</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems"]}/>
      <Modal openComponent={ <Button color="primary" variant="contained">Hello!</Button>}><div>Hello!</div></Modal>
      <Table layout={tableLayout} json={JSON.stringify(gamesystemJson)}/>
    </Page>
  );
}

export default GameSystems;

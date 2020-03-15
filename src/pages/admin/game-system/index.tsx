import { useRouter } from "next/router";
// import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import Table, { ILayoutItem } from "../../../components/design/Table";
import Page from "../../../components/Page";
import gamesystemJson from "./gamesystems.json";

const layout: ILayoutItem[] = [
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

function GameSystem() {

  return (
    <Page>
      <h1>Admin Game System Index</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems"]}/>
      <Table layout={layout} json={JSON.stringify(gamesystemJson)}/>
    </Page>
  );
}

export default GameSystem;

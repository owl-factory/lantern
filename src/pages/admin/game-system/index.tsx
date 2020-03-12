import { useRouter } from "next/router";
// import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import Table, { ILayoutItem } from "../../../components/design/Table";
import Page from "../../../components/Page";
import gamesystemJson from "./gamesystems.json";
import content from "../../api/content";

function GameSystemRows() {

}

function GameSystemTable() {

  const layout: ILayoutItem[] = [
    {
      title: "",
      component: (props: any) => {return <b>{props.content.id}</b>},
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

  return <Table layout={layout} json={JSON.stringify(gamesystemJson)}/>;
}

function GameSystem() {

  return (
    <Page>
      <h1>Admin Game System Index</h1>
      <GameSystemTable/>
    </Page>
  );
}

export default GameSystem;

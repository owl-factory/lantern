import { useRouter } from "next/router";
// import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import Table, { ILayoutItem } from "../../../components/design/Table";
import Page from "../../../components/Page";
import gamesystemJson from "./gamesystems.json";

function GameSystemRows() {

}

function GameSystemTable() {
  // return (
  //   <Table padding="default" stickyHeader={true}>
  //     <TableHead>
  //       <TableRow>
  //         <TableCell></TableCell>
  //         <TableCell>System</TableCell>
  //         <TableCell>Content</TableCell>
  //         <TableCell>Entities</TableCell>
  //         <TableCell>Tools</TableCell>
  //       </TableRow>
  //     </TableHead>

  //     <GameSystemRows/>
  //   </Table>
  // )

  const layout: ILayoutItem[] = [
    {
      header: "",
      key: "id",
    },
    {
      header: "System",
      key: "system",
    },
    {
      header: "Content",
      key: "officialContentCount",
    },
    {
      header: "Entities",
      key: "officialEntityCount",
    },
    {
      header: "Tools",
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

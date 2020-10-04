import React from "react";
import Table from "../../../components/design/tables/Table";
import { TableBuilder } from "../../../utilities/design/table";
import Page from "../../../components/design/Page";
import Link from "next/link";

/**
 * Renders links and other actions for a row of data
 * @param props A data object containing all of the information for a row
 */
function TestTableActions(props: any) {
  return <><Link href={"/game-systems/" + props.key + "/edit"} passHref><a>Edit</a></Link></>
}

/**
 * Creates a test table for checking that new changes and functionality do not break and work as intended.
 */
export default function TableTesting() {
  const tableBuilder = new TableBuilder();
  tableBuilder.addIncrementColumn("")
  .addDataColumn("Gamesystem", "name")
  .addDataColumn("Content Types", "contentTypeCount")
  .addDataColumn("Entity Types", "entityTypeCount")
  .addDataColumn("Modules", "moduleCount")
  .addComponentColumn("Actions", TestTableActions)

  const tableData = [
    {
      name: "Dungeons and Dragons 5e",
      key: "dnd-5e",
      contentTypeCount: 10,
      entityTypeCount: 3,
      moduleCount: 15,
    },
    {
      name: "Pathfinder 2",
      key: "pf2",
      contentTypeCount: 12,
      entityTypeCount: 5,
      moduleCount: 4,
    },
  ];

  return (
    <Page>
      <h2>Table Testing</h2>
      <Table {...tableBuilder.renderConfig()} data={tableData}/>
      <hr/>
      <h2>Paginated Table Testing</h2>

    </Page>
  );
}
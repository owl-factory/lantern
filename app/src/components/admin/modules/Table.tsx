import React from "react";
import { TableBuilder } from "../../../utilities/design/table";
import Table from "../../design/tables/Table";
import { ContextMenuBuilder } from "../../../utilities/design/contextMenu";
import { MdPageview, MdInfo, MdBuild } from "react-icons/md";
import { GameSystem } from "@reroll/model/dist/documents/GameSystem";

const moduleActions = new ContextMenuBuilder()
  .addLink("View", MdPageview, "/[gameSystemAlias]/modules/[moduleAlias]")
  .addLink("Details", MdInfo, "/admin/game-systems/[gameSystemAlias]/modules/[moduleAlias]")
  .addLink("Edit", MdBuild, "/admin/game-systems/[key]/modules/[moduleAlias]/edit");

/**
 * Renders the actions for the game systems page
 * @param props A game system object
 */
function ModuleActions(props: GameSystem) {
  return (
    <></>
  );
}

const tableBuilder = new TableBuilder()
  .addIncrementColumn("")
  .addDataColumn("Module", "name")
  .addDataColumn("Alias", "alias")
  .addDataColumn("Publish Type", "publishType")

  .addDataColumn("Published", "isPublished", (isPublished: boolean) => (isPublished ? "Yes" : "No"))
  .addDataColumn("Cost", "cost", (cost: number) => (cost ? `$${cost / 100}` : "--"))
  .addComponentColumn("Tools", ModuleActions);




export default function ModuleTable(props: any) {
  return <Table 
    {...tableBuilder.renderConfig()} 
    data={props.modules} 
    startingIncrement={(props.pageState.page - 1) * props.pageState.perPage + 1}
  />
}
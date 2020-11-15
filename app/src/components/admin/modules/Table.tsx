import React from "react";
import { TableBuilder } from "../../../utilities/design/table";
import Table from "../../design/tables/Table";
import { ContextMenuBuilder } from "../../../utilities/design/contextMenu";
import { MdPageview, MdInfo, MdBuild } from "react-icons/md";
import ContextMenu from "../../design/contextMenus/ContextMenu";
import { GameSystem, Module } from "@reroll/model/dist/documents";
import { PageState } from "../../design/Pagination";

interface ModuleTableProps {
  gameSystem: GameSystem;
  modules: Module[];
  pageState: PageState;
}

const moduleActions = new ContextMenuBuilder()
  .addLink("View", MdPageview, "/[gameSystemAlias]/modules/[moduleAlias]")
  .addLink("Details", MdInfo, "/admin/game-systems/[gameSystemAlias]/modules/[moduleAlias]")
  .addLink("Edit", MdBuild, "/admin/game-systems/[gameSystemAlias]/modules/[moduleAlias]/edit");

/**
 * Renders the actions for the game systems page
 * @param props A game system object
 */
function ModuleActions(props: {data: Module, globalData: GameSystem}) {

  return (
    <ContextMenu 
      context={{
        name: props.data.name,
        moduleAlias: props.data.alias || props.data._id,
        gameSystemAlias: props.globalData.alias || props.globalData._id
      }} 
      {...moduleActions.renderConfig()}
    />
  );
}
const tableBuilder = new TableBuilder()
  .addIncrementColumn("")
  .addDataColumn("Module", "name")
  .addDataColumn("Alias", "alias")
  .addDataColumn("Publish Type", "publishType")

  // .addDataColumn("Published", "isPublished", (isPublished: boolean) => (isPublished ? "Yes" : "No"))
  // .addDataColumn("Cost", "cost", (cost: number) => (cost ? `$${cost / 100}` : "--"))
  .addComponentColumn("Tools", ModuleActions);

export default function ModuleTable(props: ModuleTableProps): JSX.Element {
  return <Table 
    {...tableBuilder.renderConfig()} 
    data={props.modules as unknown as Record<string, unknown>[]}
    globalData={props.gameSystem as Record<string, unknown>}
    startingIncrement={(props.pageState.page - 1) * props.pageState.perPage + 1}
  />
}
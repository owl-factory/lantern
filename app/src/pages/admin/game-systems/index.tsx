import React from "react";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import Table from "../../../components/design/tables/Table";
import Page from "../../../components/design/Page";
import gamesystemJson from "./gamesystems.json";
import { TableBuilder } from "../../../utilities/design/table";
import Link from "next/link";
import GameSystemModel from "../../../models/database/gameSystems";
import ContextDropdown from "../../../components/design/contextMenus/ContextDropdown";
import { ContextMenuBuilder } from "../../../utilities/design/contextMenu";
import { MdBuild, MdInfo, MdPageview, MdBlock } from "react-icons/md";
import Tooltip from "../../../components/design/Tooltip";

const gameSystemActions = new ContextMenuBuilder()
  .addLink("View", MdPageview, "/game-systems/[key]")
  .addLink("Details", MdInfo, "/admin/game-systems/[key]")
  .addLink("Edit", MdBuild, "/admin/game-systems/[key]/edit")
  .addItem("Delete", MdBlock, (context: GameSystemModel) => (confirm(`Are you sure you want to delete ${context.name}?`)))

/**
 * Renders the actions for the game systems page
 * @param props A game system object
 */
function GameSystemActions(props: GameSystemModel) {
  // View, Details, Edit, Modules
  return (
    <ContextDropdown as={ButtonGroup} context={props} {...gameSystemActions.renderConfig()}>
      <Tooltip title="View">
        <Link href="/game-systems/[key]" as={`/game-systems/${props.key}`}>
          <Button><MdPageview/></Button>
        </Link>
      </Tooltip>

      <Tooltip title="Details">
        <Link href="/admin/game-systems/[key]" as={`/admin/game-systems/${props.key}`}>
          <Button><MdInfo/></Button>
        </Link> 
      </Tooltip>

      <Tooltip title="More"><Dropdown.Toggle split id={`dropdown-toggle-${props.key}`}>...</Dropdown.Toggle></Tooltip>
    </ContextDropdown>
  );
}

/**
 * @param gameSystems A collection of game system objects
 */
interface GameSystemsProps {
  gameSystems: GameSystemModel[];
}

/**
 * Renders the Admin Game Systems page
 * @param gameSystems An array of game systems
 */
function GameSystems({gameSystems}: GameSystemsProps) {
  const tableBuilder = new TableBuilder()
    .addIncrementColumn("")
    .addDataColumn("Game System", "name")
    .addDataColumn("Content Count", "contentCount")
    .addDataColumn("Entity Count", "entityCount")
    .addDataColumn("Module Count", "moduleCount")
    .addComponentColumn("Tools", GameSystemActions);

  return (
    <Page>
      <h3>Game Systems</h3>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems"]}/>
      <Link href="/admin/game-systems/new"><Button >+ Add Game System</Button></Link>
      {/* <NewGameSystemModal dirty={true}>
        <h5 >Add a new Game System</h5>
        <NewGamesystemForm/>
      </NewGameSystemModal> */}
      <Table {...tableBuilder.renderConfig()} data={gameSystems}/>
    </Page>
  );
}

GameSystems.getInitialProps = async () => {
  // const { gamesystems } = await client.query({query: getGameSystemQuery(1)})
  return { gameSystems: gamesystemJson }
}

export default GameSystems;

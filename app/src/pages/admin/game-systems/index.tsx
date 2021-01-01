import React from "react";
import { Button } from "react-bootstrap";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import Table from "../../../components/design/tables/Table";
import Page from "../../../components/design/Page";
import { GameSystem } from "@reroll/model/dist/documents/GameSystem";
import { TableBuilder } from "../../../utilities/design/table";
import Link from "next/link";
import { ContextMenuBuilder } from "../../../utilities/design/contextMenu";
import { MdBlock, MdBuild, MdInfo, MdPageview } from "react-icons/md";
import Pagination, { PageState } from "../../../components/design/Pagination";
import ContextMenu from "../../../components/design/contextMenus/ContextMenu";
import { TableComponentProps } from "../../../model/design/table";

/**
 * @param gameSystems A collection of game system objects
 */
interface GameSystemsProps {
  gameSystems: GameSystem[];
  gameSystemCount: number;
}

const initialPerPage = 10;
const gameSystemActions = new ContextMenuBuilder()
  .addLink("View", MdPageview, "/game-systems/[alias]")
  .addLink("Details", MdInfo, "/admin/game-systems/[alias]")
  .addLink("Edit", MdBuild, "/admin/game-systems/[alias]/edit")
  .addItem("Delete", MdBlock, (context: GameSystem) => (confirm(`Are you sure you want to delete ${context.name}?`)));

const tableBuilder = new TableBuilder()
  .addIncrementColumn("")
  .addDataColumn("Game System", "name")
  .addDataColumn("Alias", "alias")
  .addComponentColumn("Tools", GameSystemActions);

/**
 * Renders the actions for the game systems page
 * @param props A game system object
 */
function GameSystemActions({ data }: TableComponentProps) {
  return (
    <ContextMenu
      context={{name: data.name, alias: data.alias || data._id}}
      {...gameSystemActions.renderConfig()}
    />
  );
}

/**
 * Renders the Admin Game Systems page
 * @param gameSystems An array of game systems
 */
function GameSystems(data: GameSystemsProps): JSX.Element {
  const [ gameSystemData, setGameSystemData ] = React.useState(data);
  const [pageState, setPageState] = React.useState({
    page: 1,
    perPage: initialPerPage,
    totalCount: gameSystemData.gameSystemCount,
  });

  async function setPage(newPageState: PageState) {
    const newGameSystemData = await queryGameSystems(
      newPageState.page,
      newPageState.perPage
    );

    setGameSystemData(newGameSystemData);
    setPageState({...newPageState, totalCount: newGameSystemData.gameSystemCount});
  }

  return (
    <Page>
      <h3>Game Systems</h3>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems"]}/>
      <Button ><Link href="/admin/game-systems/new"><a>+ Add Game System</a></Link></Button>
      <Table
        {...tableBuilder.renderConfig()}
        data={gameSystemData.gameSystems}
        startingIncrement={(pageState.page - 1) * pageState.perPage + 1}
      />
      <Pagination pageState={pageState} setPageState={setPage}/>
    </Page>
  );
}

/**
 * Queries the game systems
 * @param page The current page
 * @param perPage The number of entries per page
 */
async function queryGameSystems(page: number, perPage: number, ) {
  const skip = (page - 1) * perPage;

  return { gameSystems: [], gameSystemCount: 0 };
}

GameSystems.getInitialProps = async () => {
  const gameSystemData = await queryGameSystems(1, initialPerPage);
  return gameSystemData;
};

export default GameSystems;


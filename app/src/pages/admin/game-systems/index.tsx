import React from "react";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import Table from "../../../components/design/tables/Table";
import Page from "../../../components/design/Page";
import { GameSystem } from "@reroll/model/dist/documents/GameSystem";
import { TableBuilder } from "../../../utilities/design/table";
import Link from "next/link";
import GameSystemModel from "../../../models/database/gameSystems";
import ContextDropdown from "../../../components/design/contextMenus/ContextDropdown";
import { ContextMenuBuilder } from "../../../utilities/design/contextMenu";
import { MdBuild, MdInfo, MdPageview, MdBlock } from "react-icons/md";
import Tooltip from "../../../components/design/Tooltip";
import { client } from "../../../utilities/graphql/apiClient";
import gql from "graphql-tag";
import Pagination, { PageState } from "../../../components/design/Pagination";

const initialPerPage = 10;
const gameSystemActions = new ContextMenuBuilder()
  .addLink("View", MdPageview, "/game-systems/[key]")
  .addLink("Details", MdInfo, "/admin/game-systems/[key]")
  .addLink("Edit", MdBuild, "/admin/game-systems/[key]/edit")
  .addItem("Delete", MdBlock, (context: GameSystem) => (confirm(`Are you sure you want to delete ${context.name}?`)))

/**
 * @param gameSystems A collection of game system objects
 */
interface GameSystemsProps {
  gameSystems: GameSystemModel[];
  gameSystemCount: number;
}

const tableBuilder = new TableBuilder()
  .addIncrementColumn("")
  .addDataColumn("Game System", "name")
  .addDataColumn("Alias", "alias")
  .addDataColumn("Published", "isPublished", (isPublished: boolean) => (isPublished ? "Yes" : "No"))
  .addComponentColumn("Tools", GameSystemActions);

/**
 * Renders the actions for the game systems page
 * @param props A game system object
 */
function GameSystemActions(props: GameSystem) {
  // View, Details, Edit, Modules
  const urlKey = props.alias || props._id;

  return (
    <ContextDropdown as={ButtonGroup} context={props} {...gameSystemActions.renderConfig()}>
      <Tooltip title="View">
        <Link href="/game-systems/[key]" as={`/game-systems/${urlKey}`}>
          <Button><MdPageview/></Button>
        </Link>
      </Tooltip>

      <Tooltip title="Details">
        <Link href="/admin/game-systems/[key]" as={`/admin/game-systems/${urlKey}`}>
          <Button><MdInfo/></Button>
        </Link> 
      </Tooltip>

      <Tooltip title="More"><Dropdown.Toggle split id={`dropdown-toggle-${urlKey}`}>...</Dropdown.Toggle></Tooltip>
    </ContextDropdown>
  );
}

/**
 * Renders the Admin Game Systems page
 * @param gameSystems An array of game systems
 */
function GameSystems(data: GameSystemsProps) {
  const [ gameSystemData, setGameSystemData ] = React.useState(data);
  const [pageState, setPageState] = React.useState({
    page: 1,
    perPage: initialPerPage,
    totalCount: gameSystemData.gameSystemCount
  });

  async function setPage(newPageState: PageState) {
    const newGameSystemData = await queryGameSystems(
      newPageState.page,
      newPageState.perPage  
    );

    setGameSystemData(newGameSystemData.data);
    setPageState({...newPageState, totalCount: newGameSystemData.data.gameSystemCount});
  }

  return (
    <Page>
      <h3>Game Systems</h3>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems"]}/>
      <Link href="/admin/game-systems/new"><Button >+ Add Game System</Button></Link>
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

  const gameSystemQuery = gql`
  {
    gameSystems (skip: ${skip}, limit: ${perPage}, sort: "-updatedAt") {
      _id,
      name,
      alias,
      isPublished,
      updatedAt
    },
    gameSystemCount
  }
  `;

  return await client.query({query: gameSystemQuery});
}

GameSystems.getInitialProps = async () => {
  const gameSystemData = await queryGameSystems(1, initialPerPage);
  return gameSystemData.data;
  // return {gameSystems: [], gameSystemCount: 0}
}

export default GameSystems;


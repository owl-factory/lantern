import React from "react";
import Page from "../../../../../components/design/Page";
import Breadcrumbs from "../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import ModuleTable from "../../../../../components/admin/modules/Table";
import Pagination, { PageState } from "../../../../../components/design/Pagination";
import { GameSystem, Module } from "../../../../../types/documents";

// The initial count per page that we'll be fetching
const initialPerPage = 25;

interface ModulesIndexProps {
  gameSystem: GameSystem;
  initialModules: Module[];
  moduleCount: number;
}

/**
 * Queries the game systems
 * @param page The current page
 * @param perPage The number of entries per page
 */
async function queryModules(page: number, perPage: number, gameSystemID: string) {
  const skip = (page - 1) * perPage;

  return { modules: [], moduleCount: 0 };
}

/**
 * Renders a searchable (TODO) list of modules for a game system
 *
 * @param gameSystem The game system linking the modules together
 * @param initialModules The initial modules prior to searching.
 * @param moduleCount The total count of modules in the database matching the game system
 */
export default function ModulesIndex({ gameSystem, initialModules, moduleCount }: ModulesIndexProps): JSX.Element {
  const [modules, setModules] = React.useState(initialModules);
  const [pageState, setPageState] = React.useState({
    page: 1,
    perPage: initialPerPage,
    totalCount: moduleCount,
  });

  /**
   * Sets the new page and perPage, then pulls new modules to match
   * @param newPageState The new page state (page, pageCount, etc) changes
   */
  async function setPage(newPageState: PageState) {
    const newModuleData = await queryModules(
      newPageState.page,
      newPageState.perPage,
      gameSystem._id || "null"
    );

    setModules(newModuleData.modules);
    setPageState({...newPageState, totalCount: newModuleData.moduleCount});
  }
  return (
    <Page>
      <h1>{gameSystem.name}</h1>
      <Breadcrumbs
        skipLevels={1}
        titles={["Admin", "Game Systems", gameSystem.name, "Modules"]}
      />
      <ModuleTable gameSystem={gameSystem} modules={modules} pageState={pageState}/>
      <Pagination pageState={pageState} setPageState={setPage}/>
    </Page>
  );
}

ModulesIndex.getInitialProps = async (ctx: NextPageContext) => {
  const alias = ctx.query.gameSystemAlias;

  return {
    gameSystem: {},
    initialModules: [],
    moduleCount: 0,
  };
};

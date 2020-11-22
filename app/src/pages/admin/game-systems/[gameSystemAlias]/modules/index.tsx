import React from "react";
import Page from "../../../../../components/design/Page";
import Breadcrumbs from "../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import gql from "graphql-tag";
import { client } from "../../../../../utilities/graphql/apiClient";
import ModuleTable from "../../../../../components/admin/modules/Table";
import Pagination, { PageState } from "../../../../../components/design/Pagination";
import { GameSystem, Module } from "@reroll/model/dist/documents";

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

  const moduleQuery = gql`
  {
    modules (
      filters: {gameSystemID_eq: "${gameSystemID}"}
      skip: ${skip},
      limit: ${perPage},
      sort: "-updatedAt"
    ) {
      _id,
      name, 
      alias,
      publishType,
      isPublished,
      isPurchasable,
      cost
    },
    moduleCount (filters: {gameSystemID_eq: "${gameSystemID}"})
  }
  `;

  return await client.query({query: moduleQuery});
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
    totalCount: moduleCount
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
  
    setModules(newModuleData.data.modules);
    setPageState({...newPageState, totalCount: newModuleData.data.moduleCount});
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

  const query = gql`query {
    gameSystem (_id: "${alias}") {
      _id,
      name,
      alias
    }
  }`;

  const { data } = await client.query({query: query});
  const moduleData = await queryModules(1, initialPerPage, data.gameSystem._id);

  return { 
    gameSystem: data.gameSystem,
    initialModules: moduleData.data.modules,
    moduleCount: moduleData.data.moduleCount,
  };
}
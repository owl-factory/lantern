import React from "react";
import { NextPageContext } from "next";
import gql from "graphql-tag";
import { ContentTypeTable } from "../../../../../components/admin/contentTypes/Table";
import { client } from "../../../../../utilities/graphql/apiClient";
import Page from "../../../../../components/design/Page";
import Breadcrumbs from "../../../../../components/design/Breadcrumbs";
import Pagination, { PageState } from "../../../../../components/design/Pagination";
import { ContentType, GameSystem } from "@reroll/model/dist/documents";

const initialPerPage = 25;

interface ContentTypeViewProps {
  gameSystem: GameSystem;
  initialContentTypes: ContentType[];
  contentTypeCount: number;
}

async function fetchContentTypes(
  page: number,
  perPage: number,
  gameSystemID: string
  ) {
  const contentTypeQuery = gql`
  query {
    contentTypes (
      filters: {gameSystemID_eq: "${gameSystemID}"},
      skip: ${(page - 1) * perPage},
      limit: ${perPage}
    ) {
      _id,
      name,
      alias,
      isTypeOnly
    },
    contentTypeCount (filters: {gameSystemID_eq: "${gameSystemID}"})
  }`;

  return (await client.query({query: contentTypeQuery}))["data"];

}

/**
 * Renders the information page for the game system
 * @param gameSystem The gamesystem object pulled from the database
 * @param modules A list of modules ordered by last updated to provide a peek
 * @param moduleCount The total count of modules that exist within this gamesystem
 * @param entityCount The total count of entities that exist within this gamesystem
 * @param contentCount The total count of content that exist within this gamesystem
 */
export default function ContentTypeView({
  gameSystem,
  initialContentTypes,
  contentTypeCount,
}: ContentTypeViewProps): JSX.Element {

  const [ contentTypes, setContentTypes ] = React.useState(initialContentTypes);
  const [ pageState, setPageState ] = React.useState({
    page: 1,
    perPage: initialPerPage,
    totalCount: contentTypeCount,
  });

  /**
   * Sets the new page and perPage, then pulls new content types to match
   * @param newPageState The new page state (page, pageCount, etc) changes
   */
  async function setPage(newPageState: PageState) {
    const { data } = await fetchContentTypes(
      newPageState.page,
      newPageState.perPage,
      gameSystem._id || "undefined"
    );

    setContentTypes(data.contentTypes);
    setPageState({...newPageState, totalCount: data.contentTypeCount});
  }

  return (
    <Page>
      <h1>{gameSystem.name}</h1>
      <Breadcrumbs
        skipLevels={1}
        titles={["Admin", "Game Systems", gameSystem.name, "Content Types"]}
      />

      <ContentTypeTable contentTypes={contentTypes} pageState={pageState} gameSystem={gameSystem}/>
      <Pagination pageState={pageState} setPageState={setPage}/>

    </Page>
  );
}

ContentTypeView.getInitialProps = async (ctx: NextPageContext) => {
  const alias = ctx.query.gameSystemAlias;

  // TODO - can we merge this into the fetchContentType query to save calls?
  const gameSystemQuery = gql`
  {
    gameSystem (_id: "${alias}") {
      _id,
      name,
      alias
    }
  }`;

  const { gameSystem } = (await client.query({query: gameSystemQuery}))["data"];

  const { contentTypes, contentTypeCount } = await fetchContentTypes(
    1,
    initialPerPage,
    gameSystem._id
  );

  return {
    gameSystem,
    initialContentTypes: contentTypes,
    contentTypeCount,
  };
};

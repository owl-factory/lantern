import React from "react";
import { Card, Button, Col, Row } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import gql from "graphql-tag"; 
import { ContentTypeTable } from "../../../../../components/admin/contentTypes/Table";
import { client } from "../../../../../utilities/graphql/apiClient";
import Page from "../../../../../components/design/Page";
import Breadcrumbs from "../../../../../components/design/Breadcrumbs";

const initialPerPage = 25;

/**
 * Publishes a game system
 * @param _id The id of the gamesystem to publish
 */
function publish(_id: string) {
  const publishGameSystem = gql`mutation {
    updateGameSystem(_id: "${_id}", data: {isPublished: true}) {
      ok
    }
  }`;

  client.mutate({mutation: publishGameSystem})
  .then((res: any) => {
    // TODO - need a way to refetch this!
    console.log("Published!")
  })
}

async function fetchContentTypes(
  gameSystemID: string, 
  page: number, 
  perPage: number
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
      alias
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
export default function GameSystemView({
  gameSystem,
  initialContentTypes,
  contentTypeCount
}: any) {
  const router = useRouter();
  const alias = router.query.gameSystemAlias;

  const [ contentTypes, setContentTypes ] = React.useState(initialContentTypes);
  const [ pageState, setPageState ] = React.useState({
    page: 1, 
    perPage: initialPerPage, 
    totalCount: contentTypeCount
  })
  
  return (
    <Page>
      <h1>{gameSystem.name}</h1>
      <Breadcrumbs
        skipLevels={1}
        titles={["Admin", "Game Systems", gameSystem.name!, "Content Types"]}
      />

      <ContentTypeTable contentTypes={contentTypes} pageState={pageState}/>
      
    </Page>
  );
}

GameSystemView.getInitialProps = async (ctx: NextPageContext) => {
  const alias = ctx.query.gameSystemAlias;

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
    gameSystem._id,
    1,
    initialPerPage
  );
  
  return {
    gameSystem,
    initialContentTypes: contentTypes,
    contentTypeCount
  };
}
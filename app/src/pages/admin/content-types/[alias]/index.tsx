import React from "react";
import Page from "../../../../components/design/Page";
import { Card, Button, Col, Row } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import Breadcrumbs from "../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import gql from "graphql-tag"; 
import { client } from "../../../../utilities/graphql/apiClient";
import { CampaignCard } from "../../../../components/admin/campaigns/Card";
import { EntityTypeCard } from "../../../../components/admin/entityTypes/Card";
import { ModuleCard } from "../../../../components/admin/modules/Card";
import { ContentCard } from "../../../../components/admin/content/Card";
import { EntityCard } from "../../../../components/admin/entities/Card";
import { ContentTypeCard } from "../../../../components/admin/contentTypes/Card";

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

/**
 * Renders the information page for the game system
 * @param gameSystem The gamesystem object pulled from the database
 * @param modules A list of modules ordered by last updated to provide a peek
 * @param moduleCount The total count of modules that exist within this gamesystem
 * @param entityCount The total count of entities that exist within this gamesystem
 * @param contentCount The total count of content that exist within this gamesystem
 */
export default function GameSystemView({commonContentType}: any) {
  const router = useRouter();
  const alias = router.query.alias;
  
  return (
    <Page>
      <h1>Common Content Type: {commonContentType.name}</h1>
      <Breadcrumbs skipLevels={1} titles={[
        "Admin",
        "Common Content Type",
        commonContentType.name!
      ]}/>
     
      <Card>
        <Card.Header>
          <>Details</>
        </Card.Header>
        <Card.Body>
          <b>Description:</b> {commonContentType.description}<br/>
          <b>Alias:</b> {commonContentType.alias}<br/>
          <b>Created At:</b> {commonContentType.createdAt}<br/>
          <b>Last Edited At:</b> {commonContentType.updatedAt}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          Settings
        </Card.Header>

        <Card.Body>
          <Link href={"/admin/content-types/" + alias + "/edit"}  passHref>
            <Button>Edit</Button>
          </Link>

          <Button>Delete</Button>

        </Card.Body>
      </Card>
      
    </Page>
  );
}

GameSystemView.getInitialProps = async (ctx: NextPageContext) => {
  const alias = ctx.query.alias;

  const commonContentTypeQuery = gql`
  {
    commonContentType (_id: "${alias}") {
      _id,
      name,
      alias,
      description,
      createdAt,
      updatedAt,
    }
  }`;

  const { data } = await client.query({query: commonContentTypeQuery});
  console.log(data)
  
  return {
    commonContentType: data.commonContentType
  };
}
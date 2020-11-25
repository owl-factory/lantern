import React from "react";
import Page from "../../../../components/design/Page";
import { Button, Card } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import Breadcrumbs from "../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import gql from "graphql-tag";
import { client } from "../../../../utilities/graphql/apiClient";
import { CommonEntityType } from "@reroll/model/dist/documents";

interface CommonEntityTypeViewProps {
  commonEntityType: CommonEntityType;
}

/**
 * Renders the information page for the game system
 * @param gameSystem The gamesystem object pulled from the database
 * @param modules A list of modules ordered by last updated to provide a peek
 * @param moduleCount The total count of modules that exist within this gamesystem
 * @param entityCount The total count of entity that exist within this gamesystem
 */
export default function CommonEntityTypeView({commonEntityType}: CommonEntityTypeViewProps): JSX.Element {
  const router = useRouter();
  const alias = router.query.alias;

  return (
    <Page>
      <h1>Common Entity Type: {commonEntityType.name}</h1>
      <Breadcrumbs skipLevels={1} titles={[
        "Admin",
        "Common Entity Type",
        commonEntityType.name,
      ]}/>

      <Card>
        <Card.Header>
          <>Details</>
        </Card.Header>
        <Card.Body>
          <b>Alias:</b> {commonEntityType.alias}<br/>
          <b>Created At:</b> {commonEntityType.createdAt}<br/>
          <b>Last Edited At:</b> {commonEntityType.updatedAt}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          Settings
        </Card.Header>

        <Card.Body>
          <Link href={"/admin/entity-types/" + alias + "/edit"}  passHref>
            <Button>Edit</Button>
          </Link>

          <Button>Delete</Button>

        </Card.Body>
      </Card>

    </Page>
  );
}

CommonEntityTypeView.getInitialProps = async (ctx: NextPageContext) => {
  const alias = ctx.query.alias;

  const commonEntityTypeQuery = gql`
  {
    commonEntityType (_id: "${alias}") {
      _id,
      name,
      alias,
      createdAt,
      updatedAt,
    }
  }`;

  const { data } = await client.query({query: commonEntityTypeQuery});

  return {
    commonEntityType: data.commonEntityType,
  };
};

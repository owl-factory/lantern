import React from "react";
import Page from "../../../../../../components/design/Page";
import Breadcrumbs from "../../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import gql from "graphql-tag";
import { client } from "../../../../../../utilities/graphql/apiClient";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";

export default function ContentTypeView({contentType, gameSystem}: any) {
  const router = useRouter();
  const { gameSystemAlias, contentTypeAlias } = router.query;
  return (
    <Page>
      <h1>{contentType.name}</h1>
      <Breadcrumbs
        skipLevels={1}
        titles={[
          "Admin",
          "Game Systems",
          gameSystem.name!,
          "Content Types",
          contentType.name
        ]}
      />

      <Row>
        <Col>
          {/* Content Types */}
          <Card>
            <Card.Header>
              <>Details</>
            </Card.Header>
            <Card.Body>
              <b>Description:</b> {contentType.description}<br/>
              <b>Alias:</b> {contentType.alias}<br/>
              <b>Created At:</b> {contentType.createdAt}<br/>
              <b>Last Edited At:</b> {contentType.updatedAt}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <hr/>

      <Row>
        <Col>
          {/* Content Types */}
          <Card>
            <Card.Header>
              <>Settings</>
            </Card.Header>
            <Card.Body>
              {/* SET DEFAULT */}

              {/* EDIT */}
              <Link 
                href={`/admin/game-systems/${gameSystemAlias}/content-types/${contentTypeAlias}/edit`} 
                passHref
              >
                <Button>Edit Information</Button>
              </Link>

              <Link 
                href={`/admin/game-systems/${gameSystemAlias}/content-types/${contentTypeAlias}/fields`} 
                passHref
              >
                <Button>Edit Fields</Button>
              </Link>

              <Link 
                href={`/admin/game-systems/${gameSystemAlias}/content-types/${contentTypeAlias}/card-layout`} 
                passHref
              >
                <Button>Edit Card Layout</Button>
              </Link>

              <Link 
                href={`/admin/game-systems/${gameSystemAlias}/content-types/${contentTypeAlias}/search-layout`} 
                passHref
              >
                <Button>Edit Search Layout</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
    </Page>
  )
}

ContentTypeView.getInitialProps = async (ctx: NextPageContext) => {
  const { gameSystemAlias, contentTypeAlias } = ctx.query;
  let query = gql`query {
    contentType(_id: "${contentTypeAlias}", gameSystemID: "${gameSystemAlias}") {
      _id,
      name,
      alias,
      isTypeOnly,
      description,
      fields {
        name,
        default,
        type,
        readonly
      },
      createdAt,
      updatedAt
    },
    gameSystem(_id: "${gameSystemAlias}") {
      _id,
      name,
      alias
    }
  }`;

  const { contentType, gameSystem } = (await client.query({query}))["data"];
  
  return { contentType, gameSystem };
}
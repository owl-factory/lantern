import React from "react";
import Page from "../../../../components/design/Page";
import { Card, Button, Col, Row } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import Breadcrumbs from "../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import gql from "graphql-tag"; 
import { client } from "../../../../utilities/graphql/apiClient";
import { GameSystem } from "@reroll/model/dist/documents/GameSystem";

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
 */
export default function GameSystemView({gameSystem, moduleCount, entityCount, contentCount}: any) {
  const router = useRouter();
  const { alias } = router.query;
  
  return (
    <Page>
      <h1>{gameSystem.name}</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", gameSystem.name!]}/>

      <Row>
        <Col lg={3} md={4} sm={6} xs={12}>
          <Card><Card.Body>
            <>Modules</>
            <p>{moduleCount}</p>  
          </Card.Body></Card>
        </Col>

        <Col lg={3} md={4} sm={6} xs={12}>
          <Card><Card.Body>
            <>Entities</>
            <p>{entityCount}</p>  
          </Card.Body></Card>
        </Col>

        <Col lg={3} md={4} sm={6} xs={12}>
          <Card><Card.Body>
            <>Content</>
            <p>{contentCount}</p>  
          </Card.Body></Card>
        </Col>

        <Col lg={3} md={4} sm={6} xs={12}>
          <Card><Card.Body>
            <>Published?</>
            <p>{gameSystem.isPublished ? "Yes" : "No"}</p>  
          </Card.Body></Card>
        </Col>
      </Row>

      <hr/>

      <Row>
        <Col>
          {/* Content Types */}
          <Card>
            <Card.Header>
              <>Details</>
            </Card.Header>
            <Card.Body>
              <b>Description:</b> {gameSystem.description}<br/>
              <b>Alias:</b> {gameSystem.alias}<br/>
              <b>Created At:</b> {gameSystem.createdAt}<br/>
              <b>Last Edited At:</b> {gameSystem.updatedAt}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <hr/>

      <Row>
        <Col lg={6} md={12}>
          {/* Content Types */}
          <Card>
            <Card.Header>
              <>Content Types</>
              <Link href={"/admin/game-systems/" + alias + "/content-types/new"}  passHref>
                <Button size="sm" style={{float:"right"}}>Add Content Type</Button>
              </Link>
            </Card.Header>
            <Card.Body>
              {/* Table */}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} md={12}>
          {/* Entity Types */}
          <Card>
            <Card.Header>
              <>Entity Types</>
              <Link href={"/admin/game-systems/" + alias + "/entity-types/new"}  passHref>
                <Button size="sm" style={{float:"right"}}>Add Entity Type</Button>
              </Link>
            </Card.Header>
            <Card.Body>
              {/* Table */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <hr/>

      <Card>
        <Card.Header>
          <>Modules</>
          <Link href={"/admin/game-systems/" + alias + "/modules/new"}  passHref>
            <Button size="sm" style={{float:"right"}}>Add Modules</Button>
          </Link>
        </Card.Header>

        <Card.Body>

        </Card.Body>
      </Card>

      <hr/>

      <Card>
        <Card.Header>
          <>Entities</>
          <Link href={"/admin/game-systems/" + alias + "/entities/new"}  passHref>
            <Button size="sm" style={{float:"right"}}>Add Entity</Button>
          </Link>
        </Card.Header>

        <Card.Body>

        </Card.Body>
      </Card>

      <hr/>

      <Card>
        <Card.Header>
          <>Content</>
          <Link href={"/admin/game-systems/" + alias + "/content/new"}  passHref>
            <Button size="sm" style={{float:"right"}}>Add Content</Button>
          </Link>
        </Card.Header>

        <Card.Body>

        </Card.Body>
      </Card>

      <hr/>

      <Card>
        <Card.Header>
          Settings
        </Card.Header>

        <Card.Body>
          <Link href={"/admin/game-systems/" + alias + "/edit"}  passHref>
            <Button>Edit</Button>
          </Link>

          <Button 
            disabled={gameSystem.isPublished}
            onClick={() => publish(gameSystem._id)}
          >
            Publish{gameSystem.isPublished ? "ed" : ""}
          </Button>
          <Button>Delete</Button>

        </Card.Body>
      </Card>
      
    </Page>
  );
}

GameSystemView.getInitialProps = async (ctx: NextPageContext) => {
  const alias = ctx.query.alias;

  const gameSystemQuery = gql`
  {
    gameSystem (_id: "${alias}") {
      _id,
      name,
      alias,
      description,
      isPublished,
      createdAt,
      updatedAt,
    }
  }`;

  const { data } = await client.query({query: gameSystemQuery});

  const moduleQuery = gql`
  query {
    moduleCount (filters: {gameSystemID_eq: "${data.gameSystem._id}"})
  }`;
  
  const moduleData  = await client.query({query: moduleQuery});
  return {
    gameSystem: data.gameSystem, 
    moduleCount: moduleData.data.moduleCount,
    entityCount: 0,
    contentCount: 0
  };
}
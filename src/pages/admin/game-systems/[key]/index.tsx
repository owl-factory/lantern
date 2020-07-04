import React from "react";
import Page from "../../../../components/design/Page";
import { Card, Button, Col, Row } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import Breadcrumbs from "../../../../components/design/Breadcrumbs";


export default function GameSystem({gameSystem}: any) {
  const router = useRouter();
  const { key } = router.query;
  console.log(gameSystem)
  return (
    <Page>
      <h1>{gameSystem.name}</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", gameSystem.name]}/>

      <Row>
        <Col lg={3} md={4} sm={6} xs={12}>
          <Card><Card.Body>
            <>Content Types</>
            <p>{gameSystem.contentTypeCount}</p>  
          </Card.Body></Card>
        </Col>

        <Col lg={3} md={4} sm={6} xs={12}>
          <Card><Card.Body>
            <>Entity Types</>
            <p>{gameSystem.entityTypeCount}</p>  
          </Card.Body></Card>
        </Col>

        <Col lg={3} md={4} sm={6} xs={12}>
          <Card><Card.Body>
            <>Modules</>
            <p>{gameSystem.moduleCount}</p>  
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
        <Col lg={6} md={12}>
          {/* Content Types */}
          <Card>
            <Card.Header>
              <>Content Types</>
              <Link href={"/admin/game-systems/" + key + "/content-types/new"}  passHref>
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
              <Link href={"/admin/game-systems/" + key + "/entity-types/new"}  passHref>
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
          <Link href={"/admin/game-systems/" + key + "/modules/new"}  passHref>
            <Button size="sm" style={{float:"right"}}>Add Modules</Button>
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

        </Card.Body>
      </Card>
      
    </Page>
  );
}

GameSystem.getInitialProps = async () => {

  return { gameSystem: {
    name: "Dungeons and Dragons 5e",
    isPublished: false,
    contentTypeCount: 11,
    entityTypeCount: 3,
    moduleCount: 13,
  }}
}
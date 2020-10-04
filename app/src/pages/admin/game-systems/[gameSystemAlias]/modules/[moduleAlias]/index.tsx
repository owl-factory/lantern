import Page from "../../../../../../components/design/Page";
import Breadcrumbs from "../../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import gql from "graphql-tag";
import { client } from "../../../../../../utilities/graphql/apiClient";
import { Row, Col, Card } from "react-bootstrap";

/**
 * Renders the details regarding a module
 * @param gameSystem The game system the module belongs to
 * @param module The details of the current module
 */
export default function ModuleView({ 
  gameSystem,
  module,
  campaignCount,
  entityCount,
  contentCount
}: any) {
  return (
    <Page>
      <h1>New {gameSystem.name} Module</h1>
      <Breadcrumbs 
        skipLevels={1} 
        titles={["Admin", "Game Systems", gameSystem.name, "Modules", module.name]}
      />
      <Row>
        <Col lg={3} md={4} sm={6} xs={12}>
          <Card><Card.Body>
            <>Campaigns</>
            <p>{campaignCount}</p>  
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
            <p>{module.isPublished ? "Yes" : "No"}</p>  
          </Card.Body></Card>
        </Col>

        <Col lg={3} md={4} sm={6} xs={12}>
          <Card><Card.Body>
            <>Cost</>
            <p>{module.cost ? `$${module.cost / 100}` : "Free"}</p>  
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
              <b>Description:</b> {module.description}<br/>
              <b>Alias:</b> {module.alias}<br/>
              <b>Created At:</b> {module.createdAt}<br/>
              <b>Last Edited At:</b> {module.updatedAt}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

ModuleView.getInitialProps = async (ctx: NextPageContext) => {
  const { gameSystemAlias, moduleAlias } = ctx.query;

  const query = gql`query {
    gameSystem (_id: "${gameSystemAlias}") {
      _id,
      name
    },
    module (_id: "${moduleAlias}") {
      _id,
      name,
      alias,
      description,
      isPublished,
      cost,
      createdAt,
      updatedAt
    }
  }`;

  const { data } = await client.query({query: query});
  return { 
    gameSystem: data.gameSystem,
    module: data.module,
    campaignCount: 0,
    entityCount: 0,
    contentCount: 0,
  };
}
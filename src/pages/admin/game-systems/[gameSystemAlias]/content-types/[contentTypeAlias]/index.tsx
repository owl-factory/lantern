import React from "react";
import Page from "../../../../../../components/design/Page";
import Breadcrumbs from "../../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import { ContentType, GameSystem } from "../../../../../../types/documents";

interface ContentTypeViewProps {
  contentType: ContentType;
  gameSystem: GameSystem;
}

/**
 * Renders a view of the current content type
 * @param contentType The content type to render
 * @param gameSystem The game system the content type belongs to
 */
export default function ContentTypeView({contentType, gameSystem}: ContentTypeViewProps): JSX.Element {
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
          gameSystem.name,
          "Content Types",
          contentType.name,
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
  );
}

ContentTypeView.getInitialProps = async (ctx: NextPageContext) => {
  const { gameSystemAlias, contentTypeAlias } = ctx.query;

  return { contentType: {}, gameSystem: {} };
};

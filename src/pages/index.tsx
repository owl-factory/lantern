import { Page } from "components/design";
import { AuthenticationCard } from "components/authentication";
import Link from "next/link";
import React from "react";
import { Button, Col, Row } from "react-bootstrap";

/**
 * Renders the not logged in index page
 * @param props ...
 */
function Index(): JSX.Element {

  return (
    <Page>
      <h3>
        Welcome to Reroll!
      </h3>
      <p>
        Reroll is a new in development web app for playing tabletop games with friends.
        There isn't much here yet but there will be some day soon.
      </p>

      <Row>
        <Col md="8" sm="12">
          <p>
            This is some test home page content. Oh look, a button!
          </p>
          <Link href="/about" passHref>
            <Button title="About">
              About
            </Button>
          </Link>

          <Link href="/characters" passHref>
            <Button title="Characters">
              Characters
            </Button>
          </Link>
        </Col>
        <Col md="4" sm="12">
          <AuthenticationCard />
        </Col>
      </Row>
    </Page>
  );
}

export default Index;

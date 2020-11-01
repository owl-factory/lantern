import Link from "next/link";
import React from "react";
import News from "../components/announcements/News";
import AuthenticationCard from "../components/authetication/AuthenticationCard";
import Page from "../components/design/Page";
import { Row, Button, Col, Form } from "react-bootstrap";
import { client } from "../utilities/graphql/apiClient";
import gql from "graphql-tag";
import { signOut, useSession } from "next-auth/client";

/**
 * Renders the index page and one of two subviews
 *
 * @param props ...
 */
function Index(props: any) {
  // Sets the view for the currenly logged in user
  const [ session, loading ] = useSession();

  if (loading) return <></>;

  return (
    <Page>
      {session ? (<UserView />) : (<GuestView />)}
      <h4>
        News
      </h4>
    </Page>
  );
}

function testGQL() {
  const query = gql`
  {
    user {
      _id,
      name
    }
  }
  `;
  client.query({query}).then((res) => {
    console.log(res.data)
  })
}

/**
 * Renders the view for users who are logged in
 * @param props TODO
 */
function UserView(props: any) {
  return (
    <div>
      <h3>Welcome back!</h3>
      <Button onClick={() => testGQL()}>Test GQL</Button>
      <Button onClick={() => signOut()}>Log Out</Button>
      {/* Recent Games */}
      <h4>My Games</h4>
      {/* Characters */}
      <h4>My Characters</h4>
    </div>
  );
}

/**
 * Renders the view for new visitors or users not logged in
 * @param props TODO
 */
function GuestView(props: any) {

  return (
    <>
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
          <Button onClick={() => testGQL()}>Test GQL</Button>
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
    </>
  );
}

export default Index;

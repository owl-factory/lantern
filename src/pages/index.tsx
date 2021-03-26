import Link from "next/link";
import React from "react";
import AuthenticationCard from "../components/authetication/AuthenticationCard";

import { Button, Col, Row } from "react-bootstrap";
import { signOut, useSession } from "next-auth/client";
import { Page } from "components";

/**
 * Renders the index page and one of two subviews
 *
 * @param props ...
 */
function Index(): JSX.Element {
  // Sets the view for the currenly logged in user
  const [ session, loading ] = useSession();

  if (loading) return <>Loading...</>;

  return (
    <Page>
      {session ? (<UserView />) : (<GuestView />)}
      <h4>
        News
      </h4>
    </Page>
  );
}

function RecentGames() {
  return (
    <div>
      <h4>
        Recent Games
        <Link href="/tables/new" passHref>
          <Button className="float-end">
            Create New Game
          </Button>
        </Link>
      </h4>
      Tables Go Here
    </div>
  );
}

/**
 * Renders the view for users who are logged in
 * @param props TODO
 */
function UserView() {
  return (
    <div>
      <h3>Welcome back!</h3>
      <Button onClick={() => signOut()}>Log Out</Button>
      {/* Recent Games */}
      <RecentGames/>

      {/* Characters */}
      <h4>My Characters</h4>
    </div>
  );
}

/**
 * Renders the view for new visitors or users not logged in
 * @param props TODO
 */
function GuestView() {

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

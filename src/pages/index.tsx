import Link from "next/link";
import React from "react";
import AuthenticationCard from "../components/authetication/AuthenticationCard";
import Page from "../components/design/Page";
import { Button, Col, Row } from "react-bootstrap";
import { signOut, useSession } from "next-auth/client";
import DynamicLayout from "../components/layouts/Layouts";
import { Entity } from "../types/documents";

const dynamicLayout: any = {
  name: "Test Layout",
  pages: [
    { name: "Character", sections: [
      { w: { xs: 12 }, h: 10, subsections: ["name"] },
      { w: { md: 1, xs: 12 }, h: 45, subsections: [] },
      { w: { md: 3, xs: 12 }, h: 45, subsections: ["inspiration", "proficiency"] },
      { w: { md: 4, xs: 12 }, h: 45, subsections: [] },
      { w: { md: 4, xs: 12 }, h: 45, subsections: [] },
    ] },
    { name: "Spells", sections: [

    ]}
  ],
  isStatic: false,
}

const character: Entity = {
  name: "Waals O'Caera"
}

/**
 * Renders the index page and one of two subviews
 *
 * @param props ...
 */
function Index(): JSX.Element {
  // Sets the view for the currenly logged in user
  const [ session, loading ] = useSession();

  if (loading) return <></>;

  return (
    <Page>
      {session ? (<UserView />) : (<GuestView />)}
      <h4>
        News
      </h4>

      <DynamicLayout
        dynamicLayout={dynamicLayout}
        entity={character}
        onSubmit={(values: any) => {console.log(values)}}
      />
    </Page>
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

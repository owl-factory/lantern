import { Input, Page } from "components";
import AuthenticationCard from "components/authetication/AuthenticationCard";
import { Form, Formik } from "formik";
import Link from "next/link";
import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { CampaignDoc } from "types";
import { rest } from "utilities";
import { signOut, useSession } from "utilities/auth";

/**
 * Renders the index page and one of two subviews
 *
 * @param props ...
 */
function Index(): JSX.Element {
  const session = useSession();

  if (session) {

    return (
      <Page>
        <UserView session={session} />
      </Page>
    );
  } else {
    return (
      <Page>
        <GuestView />
      </Page>
    );
  }
}

function RecentGames(props: any) {
  const campaigns: JSX.Element[] = [];
  props.campaigns.forEach((campaign: CampaignDoc) => {
    campaigns.push(
      <>
        <h5>{campaign.name}</h5>
        <Link href={`/campaigns/${campaign._id}`}>
          Visit
        </Link>
      </>
    );
  });

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
      {campaigns}
    </div>
  );
}

function ProfileForm(props: any) {

  async function saveProfile(values: any) {
    await rest.patch(`/api/profile`, values);
  }
  return (
    <Formik
      initialValues={props.me}
      onSubmit={saveProfile}
    >
      {() => (
        <Form>
          <Input name="name" />
          <Button type="submit">Save</Button>
        </Form>
      )}
    </Formik>
  );
}

/**
 * Renders the view for users who are logged in
 * @param props TODO
 */
function UserView(props: any) {
  const { user } = props.session;

  return (
    <div>
      <h3>Welcome back {user.data.username}!</h3>

      <Button onClick={() => signOut()}>Log Out</Button>
      {/* Recent Games */}

      {/* Characters */}
      <h4>My Characters</h4>

      <h4>Temp Profile Stuff</h4>
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

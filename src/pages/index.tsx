import Link from "next/link";
import React from "react";
import AuthenticationCard from "../components/authetication/AuthenticationCard";

import { Button, Col, Row } from "react-bootstrap";
import { signOut, useSession } from "next-auth/client";
import { Input, Page } from "components";
import { rest } from "utilities";
import { CampaignDoc, ServerResponse } from "types";
import { Form, Formik } from "formik";

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
          <Input name="name"/>
          <Button type="submit">Save</Button>
        </Form>
      )}
    </Formik>
  )
}

/**
 * Renders the view for users who are logged in
 * @param props TODO
 */
function UserView() {
  const [ me, setMe ] = React.useState({ name: "" });
  const [ characters, setCharacters ] = React.useState([]);
  const [ campaigns, setCampaigns ] = React.useState([]);

  React.useEffect(() => {
    rest.get(`/api/pages`)
    .then((res: any) => {
      console.log(res.data)
      setMe(res.data.me);
      setCampaigns(res.data.campaigns);
      console.log(res);
    });
  }, []);

  return (
    <div>
      <h3>Welcome back {me.name}!</h3>
      
      <Button onClick={() => signOut()}>Log Out</Button>
      {/* Recent Games */}
      <RecentGames campaigns={campaigns}/>

      {/* Characters */}
      <h4>My Characters</h4>

      <h4>Temp Profile Stuff</h4>
      <ProfileForm me={me}/>
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

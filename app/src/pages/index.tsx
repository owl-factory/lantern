import Link from "next/link";
import React from "react";
import News from "../components/announcements/News";
import AuthenticationCard from "../components/authetication/AuthenticationCard";
import CampaignTiles from "../components/campaigns/CampaignTiles";
import CharacterTiles from "../components/characters/CharacterTiles";
import Page from "../components/design/Page";
import campaigns from "./api/campaign/campaign.json";
import characters from "./api/character/character.json";
import news from "./api/news/news.json";
import { Row, Button, Col, Form } from "react-bootstrap";
import { anonLogin } from "../utilities/auth";
import { client } from "../utilities/graphql/realmClient";
import gql from "graphql-tag";

/**
 * Renders the index page and one of two subviews
 *
 * @param props ...
 */
function Index(props: any) {

  // Sets the view for the currenly logged in user
  const userView: JSX.Element = <GuestView/>;

  return (
    <Page>
      {userView}
      {JSON.stringify(props.token)}
      <h4>
        News
      </h4>
      <News articles={news} />
    </Page>
  );
}

/**
 * Renders the view for users who are logged in
 * @param props
 */
function UserView(props: any) {
  return (
    <div>
      <h3>Welcome back {props.session.user.displayName}!</h3>

      {/* Recent Games */}
      <h4>My Games</h4>
      <CampaignTiles contents={campaigns} includeNew={true} />

      {/* Characters */}
      <h4>My Characters</h4>
      <CharacterTiles contents={characters} includeNew={true} />
    </div>
  );
}

/**
 * Renders the view for new visitors or users not logged in
 * @param props TODO
 */
function GuestView(props: any) {

  const [test, setTest] = React.useState("");
  const [name, setName] = React.useState("");

  function gqlTest () {
    const query = gql`
    {
      characters {
        _id
        name
      }
    }
    `;
    client.query({query}).then((res) => {
      setTest(JSON.stringify(res.data));
    });
  }

  function gqlInsert() {
    const mutation = gql`
    mutation($name: String!) {
      insertOneCharacter(data: {
        name: $name
      }) {
        _id
        name
      }
    }
    `
    client.mutate({mutation, variables: { name }}).then((res) => {
      console.log(`Added ${name}`);
    });
  }

  return (
    <>
      <h3>
        Welcome to Reroll!
      </h3>
      <p>
        Reroll is a new in development web app for playing tabletop games with friends.
        There isn't much here yet but there will be some day soon.
      </p>

      <Button onClick={() => {anonLogin().then((res) => {console.log("Loged in with token:"+res.accessToken)})}}>Anon Login</Button>
      <Button onClick={() => {gqlTest()}}>Test GQL</Button>
      <p>{test}</p>

      <Form>
        <Form.Control onChange={(e) => {setName(e.target.value)}} value={name} />
        <Button onClick={() => {gqlInsert()}}>Create Character</Button>
      </Form>

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

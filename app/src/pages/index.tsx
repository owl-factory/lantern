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
import { useIdentityContext, ReactNetlifyIdentityAPI } from "react-netlify-identity";

/**
 * Renders the index page and one of two subviews
 *
 * @param props ...
 */
function Index(props: any) {
  // Sets the view for the currenly logged in user
  const identity = useIdentityContext();

  return (
    <Page>
      {(identity.isLoggedIn) ? (<UserView identity={identity} />) : (<GuestView identity={identity} />)}
      <h4>
        News
      </h4>
      <News articles={news} />
    </Page>
  );
}

interface UserViewProps {
  identity: ReactNetlifyIdentityAPI
}

/**
 * Renders the view for users who are logged in
 * @param props TODO
 */
function UserView(props: UserViewProps) {
  return (
    <div>
      <h3>Welcome back {props.identity.user?.email}!</h3>
      <Button onClick={() => props.identity.logoutUser()}>Log Out</Button>
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
        </Col>
        <Col md="4" sm="12">
          <AuthenticationCard />
        </Col>
      </Row>
    </>
  );
}

export default Index;

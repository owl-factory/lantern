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
import { Row, Button, Col } from "react-bootstrap";

/**
 * Renders the index page and one of two subviews
 *
 * @param props ...
 */
function Index(props: any) {

  // TODO - move the session up to App
  const [session, setSession] = React.useState({
    "user": {
      "isLoggedIn": false,
      "username": "laura",
      "displayName": "Laura",
    },
  });

  // Sets the view for the currenly logged in user
  let userView: JSX.Element;
  if (session.user.isLoggedIn) {
    userView = <UserView session={session} setSession={setSession}/>;
  } else {
    userView = <GuestView session={session} setSession={setSession}/>;
  }

  return (
    <Page>
      {userView}
      <h4>
        News
      </h4>
      <News articles={news}/>
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
      <CampaignTiles contents={campaigns} includeNew={true}/>

      {/* Characters */}
      <h4>My Characters</h4>
      <CharacterTiles contents={characters} includeNew={true}/>
    </div>
  );
}

/**
 * Renders the view for new visitors or users not logged in
 * @param props TODO
 */
function GuestView(props: any) {
  return (
    <div>
      <h3>
        Welcome to Reroll!
      </h3>
      <p>
        Reroll is a new in development web app for playing tabletop games with friends.
        There isn't much here yet but there will be some day soon.
      </p>

      <Link href="/about" passHref>
        <Button title="About">
          About
        </Button>
      </Link>

      <Row>
        <Col md="8" sm="12">
          <p>
            Azure Web App Test!
          </p>
        </Col>
        <Col md="4" sm="12">
          <AuthenticationCard session={props.session} setSession={props.setSession}/>
        </Col>
      </Row>
    </div>
  );
}

export default Index;

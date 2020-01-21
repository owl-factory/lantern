import { Box, Button, Grid, Input, Typography } from "@material-ui/core";
import Link from "next/link";
import React from "react";
import News from "../components/announcements/News";
import LoginBox from "../components/authetication/LoginCard";
import CampaignTiles from "../components/campaigns/CampaignTiles";
import CharacterTiles from "../components/characters/CharacterTiles";
import Page from "../components/Page";
import campaigns from "./api/campaign/campaign.json";
import characters from "./api/character/character.json";
import news from "./api/news/news.json";

/**
 * Renders the index page and one of two subviews
 *
 * @param props ...
 */
function Index(props: any) {

  // TODO - move the session up to App
  const [session, setSession] = React.useState({
    "user": {
      "isLoggedIn": true,
      "username": "laura",
      "displayName": "Laura",
    },
  });

  // Sets the view for the currenly logged in user
  let userView: JSX.Element;
  if (session.user.isLoggedIn) {
    userView = <UserView session={session} setSession={setSession}/>;
  } else {
    userView = <GuestView session={session} setStsetSessionate={setSession}/>
  }

  return (
    <Page>
      {userView}
      <Typography variant="h4">
        News
      </Typography>
      <News articles={news}/>
    </Page>
  );
}

/**
 * 
 * @param props 
 */
function UserView(props: any) {
  return (
    <div>
      <Typography variant="h3">Welcome back {props.session.user.displayName}!</Typography>

      {/* Recent Games */}
      <Typography variant="h4">My Games</Typography>
      <CampaignTiles contents={campaigns}/>

      {/* Characters */}
      <Typography variant="h4">My Characters</Typography>
      <CharacterTiles contents={characters}/>
    </div>
  );
}

function GuestView(props: any) {

  return (
    <Page>
      <Typography variant="h3" paragraph>
        Welcome to Reroll!
      </Typography>
      <Typography variant="body1" paragraph>
        Reroll is a new in development web app for playing tabletop games with friends.
        There isn't much here yet but there will be some day soon.
      </Typography>

      <Link href="/about" passHref>
        <Button title="About" color="secondary" variant="contained">
          About
        </Button>
      </Link>

      <Grid container>
        <Grid item md={8} sm={12}>
          <Typography variant="body1">
            Some stuff goes here
          </Typography>
        </Grid>
        <Grid item md={4} sm={12}>
          <LoginBox session={props.session} setSession={props.setSession}/>
        </Grid>
      </Grid>

      <div>
        <Input type="text" placeholder="Enter your username..."> </Input>
      </div>
      <div>
        <Button title="Your Account" color="secondary" variant="contained">
          Go To Profile
        </Button>
      </div>
      <div>
        <Input type="text" placeholder="Enter new username..."></Input>
      </div>
      <div>
        <Button title="Your Account" color="secondary" variant="contained">
          Create User
        </Button>
      </div>
      <div>
        <Link href="../laura-playground" passHref>
          <Button title="Laura's Playground" color="secondary" variant="contained">
            Laura's Playground
          </Button>
        </Link>
      </div>
      <div>
        Character Sheets<br />
        <Link href="../character" passHref>
          <Button title="New Character Sheet" color="secondary" variant="contained">
            Waals
          </Button>
        </Link>
      </div>
    </Page>
  );
}

export default Index;

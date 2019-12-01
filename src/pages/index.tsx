import { Button, Input, Typography } from "@material-ui/core";
import Link from "next/link";
import React from "react";
import Page from "../components/Page";

function Index() {
  return (
    <Page>
      <Typography variant="h3" paragraph>
        Welcome to Reroll!
      </Typography>
      <Typography variant="body1" paragraph>
        Reroll is a new in development web app for playing tabletop games with friends.
        There isn't much here yet but there will be some day soon.
      </Typography>
      <Link href="../about" passHref>
        <Button title="About" color="secondary" variant="contained">
          About
        </Button>
      </Link>
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

import { Button, Typography } from "@material-ui/core";
import React from "react";
import Page from "../components/Page";
import Link from "next/link";

function About() {
  return (
    <Page>
      <Typography variant="h3" paragraph>
        About
      </Typography>
      <Typography variant="body1" paragraph>
        This version of the app is really only here as a placeholder and for testing basic layout and styling.
        Well, its also here to check the performace of the app when actually published instead of only
        doing local testing. The current theme (colors and design) is just a placeholder until the day
        we get a proper desigenr on board. Still, let me know what you think!
      </Typography>
      <Typography variant="body1" paragraph>
        P.S. You are Cute, whoever you are.
      </Typography>
      <Link href="../" passHref>
        <Button title="Home" color="secondary" variant="contained">
          Home
        </Button>
      </Link>
    </Page>
  );
}

export default About;

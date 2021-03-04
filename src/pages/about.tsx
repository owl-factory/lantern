import React from "react";
import Page from "../components/design/Page";
import Link from "next/link";
import { Button } from "react-bootstrap";


function About(): JSX.Element {
  return (
    <Page>
      <h3>
        About
      </h3>
      <p>
        This version of the app is really only here as a placeholder and for testing basic layout and styling.
        Well, its also here to check the performace of the app when actually published instead of only
        doing local testing. The current theme (colors and design) is just a placeholder until the day
        we get a proper desigenr on board. Still, let me know what you think!
      </p>
      <p>
        P.S. You are Cute, whoever you are.
      </p>
      <Link href="../" passHref>
        <Button title="Home" color="secondary">
          Home
        </Button>
      </Link>
    </Page>
  );
}

export default About;

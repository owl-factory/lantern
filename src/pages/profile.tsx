import { Button, Typography } from "@material-ui/core";
import Link from "next/link";
import React from "react";
import Page from "../components/Page";

function Profile() {

  return (
    <Page>
      <Typography variant="h3" paragraph>
        Welcome to your profile BLANK
      </Typography>
      <Typography variant="body1">
        This is currently an empty user page.
      </Typography>
      <Link href="../" passHref>
        <Button title="Home" color="secondary" variant="contained">
          Home
        </Button>
      </Link>
    </Page>
  );
}

export default Profile;

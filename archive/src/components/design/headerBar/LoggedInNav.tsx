import { Grid } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

/**
 * The component for logged in navigation
 * @param user The currently logged in user
 * @returns A selection of navigation stuff for logged in navigation
 */
function LoggedInNav() {
  return (
    <Grid paddingLeft="25px" templateColumns='repeat(4, 1fr)' gap={6}>
      <Link href="/profile/1" passHref>Profile</Link>
      <Link href="/characters" passHref>Characters</Link>
      <Link href="/campaigns" passHref>Campaigns</Link>
      <Link href="/library" passHref>Library</Link>
    </Grid>
  );
}

export default LoggedInNav;

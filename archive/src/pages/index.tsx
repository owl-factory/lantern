import { Page } from "components/design";
import { AuthenticationCard } from "components/authentication";
import Link from "next/link";
import React from "react";
import { Box, Button, Flex, Grid, GridItem } from "@chakra-ui/react";

/**
 * Renders the not logged in index page
 * @param props ...
 */
function Index(): JSX.Element {

  return (
    <Page>
      <h3>
        Welcome to Lantern Tabletop!
      </h3>
      <p>
        Lantern is a new in development web app for playing tabletop games with friends.
        There isn't much here yet but there will be some day soon.
      </p>

      <Box paddingTop={10}>
        <Grid>
          <GridItem colSpan={8}>
            <Box>
              This is some test home page content. Oh look, a button! <br/>
              <Link href="/about" passHref>
                <Button bg="red.600" color="white">
                  About
                </Button>
              </Link>
            </Box>

            <Link href="/characters" passHref>
              <Button bg="red.600" color="white">
                Characters
              </Button>
            </Link>
          </GridItem>
          <GridItem colSpan={4}>
            <AuthenticationCard />
          </GridItem>
        </Grid>
      </Box>
    </Page>
  );
}

export default Index;

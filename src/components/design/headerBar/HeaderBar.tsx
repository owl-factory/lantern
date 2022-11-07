import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Auth } from "controllers/auth";
import { Box, Flex, Spacer } from "@chakra-ui/react";

function LoggedInNavPlaceholder() {
  return (<></>);
}

const LoggedInNav = dynamic(
  () => import('./LoggedInNav'),
  { loading: () => <LoggedInNavPlaceholder/>, ssr: false},
);

/**
 * The component for logged out navigation
 * @returns A selection of navigation stuff for logged out navigation
 */
function LoggedOutNav() {
  return (
    <></>
  );
}

/**
 * A standard Header Bar used on every page
 */
function HeaderBar(): JSX.Element {

  const nav = Auth.isLoggedIn || true ? <LoggedInNav/> : <LoggedOutNav/>;

  return (
    <Box bg="orange.800" color="white" w="100%" p="15px">
      <Flex>
        <Link href="/" passHref>
          <Box fontWeight={700}>Lantern</Box>
        </Link>
        {nav}
      </Flex>
    </Box>
  );
}

export default HeaderBar;

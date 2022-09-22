import { Flex, Grid, Menu, MenuButton, MenuList, Spacer } from "@chakra-ui/react";
import { Auth } from "controllers/auth";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";
import { CampaignDocument } from "types/documents";
import { signOut } from "utilities/auth";

/**
 * Builds a dropdown for accessing the admin portal
 * @param user The currently logged in user
 * @returns A dropdown section with links to the admin portal if the user is elevated. Nothing otherwise.
 */
 function ElevatedDropdown() {
  const navItems: JSX.Element[] = [];

  if (navItems.length === 0) { return <></>; }

  return (
    <Menu>
      <MenuButton>Admin Portal</MenuButton>
      <MenuList>
        {navItems}
      </MenuList>
    </Menu>
  );

}

/**
 * Renders the user's profile image and name for the Navbar selection
 * @param user The currently logged in user
 * @returns A JSX.Element displaying the user's profile image and name
 */
const UserDisplay = observer(() => {
  const user = Auth.user;

  return (
    <>
      <img
        src={user?.avatarSrc || ""}
        style={{maxHeight: "32px", maxWidth: "32px", position: "absolute"}}
      />
      <div style={{width: "36px", display: "inline-flex"}}></div>
      {user?.displayName}&nbsp;
    </>
  );
});

/**
 * Renders up to three of the user's recent campaigns for fewer clicks to game
 * @returns A component containing up to three campaigns for faster access
 */
const RecentCampaigns = observer(() => {
  const [ campaigns, setCampaigns ] = React.useState<Partial<CampaignDocument>[]>([]);
  const campaignLinks: JSX.Element[] = [];

  return (
    <>
      {campaignLinks}
    </>
  );
});

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

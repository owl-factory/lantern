import { Auth } from "controllers/auth";
import { CampaignData } from "controllers/data/CampaignData";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";
import { Nav, NavDropdown, Navbar } from "react-bootstrap"; // TODO - remove react-bootstrap
import { CampaignDocument, UserDocument } from "types/documents";
import { signOut } from "utilities/auth";


interface LoggedInNavProps {
  user: UserDocument;
}

/**
 * Builds a dropdown for accessing the admin portal
 * @param user The currently logged in user
 * @returns A dropdown section with links to the admin portal if the user is elevated. Nothing otherwise.
 */
 function ElevatedDropdown() {
  const navItems: JSX.Element[] = [];

  if (navItems.length === 0) { return <></>; }

  return <NavDropdown title="Admin Portal">{navItems}</NavDropdown>;

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
        src={user?.avatar?.src}
        style={{maxHeight: "32px", maxWidth: "32px", position: "absolute"}}
      />
      <div style={{width: "36px", display: "inline-flex"}}></div>
      {user?.name || user?.username}&nbsp;
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

  React.useEffect(() => {
    const campaignRefs = CampaignData.search({ group: "my-campaigns", perPage: 3} );
    const foundCampaigns = CampaignData.getMany(campaignRefs);
    setCampaigns(foundCampaigns);
  }, [CampaignData.lastTouched]);

  campaigns.forEach((doc: Partial<CampaignDocument>) => {
    campaignLinks.push(
      <Link key={doc.ref} href={`/play/${doc.ref}`} passHref>
        <NavDropdown.Item>{doc.name}</NavDropdown.Item>
      </Link>
    );
  });
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
  const user = Auth.user;
  return (
    <>
      <Navbar.Toggle aria-controls="basic-navbar-nav"/>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <NavDropdown title={<UserDisplay/>}>
            <RecentCampaigns/>
            <Link href="/my-campaigns" passHref>
              <NavDropdown.Item>My Campaigns</NavDropdown.Item>
            </Link>
            <NavDropdown.Divider/>
            <Link href="/my-characters" passHref>
              <NavDropdown.Item >My Characters</NavDropdown.Item>
            </Link>
            <Link href="/my-content" passHref>
              <NavDropdown.Item>My Content</NavDropdown.Item>
            </Link>
            <Link href="/library" passHref>
              <NavDropdown.Item>My Library</NavDropdown.Item>
            </Link>
            <NavDropdown.Divider/>
            <Link href="/messages" passHref>
              <NavDropdown.Item href="/messages">Messages</NavDropdown.Item>
            </Link>
            <Link href={`/profile/${user?.username}`} passHref>
              <NavDropdown.Item>My Profile</NavDropdown.Item>
            </Link>
            <Link href="/requests" passHref>
              <NavDropdown.Item>Requests</NavDropdown.Item>
            </Link>
            <Link href="/preferences" passHref>
              <NavDropdown.Item>Preferences</NavDropdown.Item>
            </Link>
            <NavDropdown.Item onClick={() => signOut()}>Log Out</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Community" id="community-dropdown">
            <Link href="/rulesets" passHref>
              <NavDropdown.Item>Rulesets</NavDropdown.Item>
            </Link>
            <Link href="/modules" passHref>
              <NavDropdown.Item>Modules</NavDropdown.Item>
            </Link>
            <Link href="/marketplace" passHref>
              <NavDropdown.Item>Marketplace</NavDropdown.Item>
            </Link>
            <Link href="/game-directory" passHref>
              <NavDropdown.Item>Game Directory</NavDropdown.Item>
            </Link>
          </NavDropdown>

          <NavDropdown title="Tools" id="tools-dropdown">
            <Link href="/characters-builder" passHref>
              <NavDropdown.Item>Character Builder</NavDropdown.Item>
            </Link>
            <Link href="/scene-builder" passHref>
              <NavDropdown.Item>Scene Builder</NavDropdown.Item>
            </Link>
          </NavDropdown>

          <NavDropdown title="Reroll" id="reroll-dropdown">
            <Link href="/about" passHref>
              <NavDropdown.Item>About Us</NavDropdown.Item>
            </Link>
            <Link href="/report-a-bug" passHref>
              <NavDropdown.Item>Report a Bug</NavDropdown.Item>
            </Link>
          </NavDropdown >

          <ElevatedDropdown/>
        </Nav>
      </Navbar.Collapse>
    </>
  );
}

export default LoggedInNav;

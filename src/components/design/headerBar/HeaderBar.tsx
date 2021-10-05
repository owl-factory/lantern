import React from "react";
import Link from "next/link";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { CampaignDocument, UserDocument } from "types/documents";
import { getSession, signOut } from "utilities/auth";
import styles from "./HeaderBar.module.scss";
import { CampaignManager } from "client/data/managers";
import { isAdmin, isModerator } from "server/logic/security";
import { MyUserDocument } from "types/security";
import { ADMIN_ENDPOINT } from "utilities/globals";

interface LoggedInNavProps {
  user: UserDocument;
}

/**
 * Renders the user's profile image and name for the Navbar selection
 * @param user The currently logged in user
 * @returns A JSX.Element displaying the user's profile image and name
 */
function UserDisplay(props: LoggedInNavProps) {
  return (
    <>
      <img src={props.user.avatar?.src} style={{maxHeight: "32px", maxWidth: "32px", position: "absolute"}}/>
      <div style={{width: "36px", display: "inline-flex"}}></div>
      {props.user.name || props.user.username}&nbsp;
    </>
  );
}

/**
 * Renders up to three of the user's recent campaigns for fewer clicks to game
 * @returns A component containing up to three campaigns for faster access
 */
function RecentCampaigns() {
  const campaignLinks: JSX.Element[] = [];

  React.useEffect(() => {
    CampaignManager.load();
  }, []);

    const campaignDocs = CampaignManager.getPage({size: 3});
    campaignDocs.forEach((doc: CampaignDocument) => {
      campaignLinks.push(
        <Link key={doc.id} href={`/play/${doc.id}`} passHref>
          <NavDropdown.Item>{doc.name}</NavDropdown.Item>
        </Link>
      );
    });
  return (
    <>
      {campaignLinks}
    </>
  );
}

/**
 * Builds a dropdown for accessing the admin portal
 * @param user The currently logged in user
 * @returns A dropdown section with links to the admin portal if the user is elevated. Nothing otherwise.
 */
function ElevatedDropdown(props: LoggedInNavProps) {
  const navItems: JSX.Element[] = [];
  if(isAdmin(props.user as unknown as MyUserDocument)) {
    navItems.push(
      <Link href={`${ADMIN_ENDPOINT}/rulesets`} passHref key="rulesets">
        <NavDropdown.Item>Rulesets</NavDropdown.Item>
      </Link>
    );
  }

  if (navItems.length === 0) { return <></>; }

  return <NavDropdown title="Admin Portal">{navItems}</NavDropdown>;

}

/**
 * The component for logged in navigation
 * @param user The currently logged in user
 * @returns A selection of navigation stuff for logged in navigation
 */
function LoggedInNav(props: LoggedInNavProps) {
  return (
    <>
      <Navbar.Toggle aria-controls="basic-navbar-nav"/>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <NavDropdown title={<UserDisplay user={props.user}/>}>
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
            <Link href={`/profile/${props.user.username}`} passHref>
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

          <ElevatedDropdown {...props}/>
        </Nav>
      </Navbar.Collapse>
    </>
  );
}

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
  const [ session ] = React.useState(getSession());

  const nav = session ? <LoggedInNav user={session.user}/> : <LoggedOutNav/>;

  return (
    <Navbar variant="dark" bg="dark" expand="lg" className={`${styles.headerBar} justify-content-between`}>
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand>Reroll</Navbar.Brand>
        </Link>
        {nav}
      </Container>
    </Navbar>
  );
}

export default HeaderBar;

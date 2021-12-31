import React from "react";
import Link from "next/link";
import { Container, Navbar } from "react-bootstrap";
import { getSession } from "utilities/auth";
import styles from "./HeaderBar.module.scss";
import dynamic from "next/dynamic";


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

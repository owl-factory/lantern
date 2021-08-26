import React from "react";
import Link from "next/link";
import { Navbar, NavbarBrand } from "components/style/navbar";

/**
 * A standard Header Bar used on every page
 */
function HeaderBar(): JSX.Element {
  return (
    <Navbar variant="dark" bg="dark" expand="lg" className="justify-content-between">
      <Link href="/" passHref>
        <NavbarBrand>Reroll</NavbarBrand>
      </Link>
    </Navbar>
  );
}

export default HeaderBar;

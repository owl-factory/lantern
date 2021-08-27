import React from "react";
import { Navbar, NavbarBrand } from "components/style/navbar";

/**
 * A standard Header Bar used on every page
 */
function HeaderBar(): JSX.Element {
  return (
    <Navbar variant="dark" bg="dark" expand="lg" className="justify-content-between">
      <NavbarBrand href="/">Reroll</NavbarBrand>
    </Navbar>
  );
}

export default HeaderBar;

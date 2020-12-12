import React from "react";
import { Button, Form, InputGroup, Navbar } from "react-bootstrap";
import { MdSearch } from "react-icons/md";
import Link from "next/link";

/**
 * A standard Header Bar used on every page
 */
function HeaderBar(): JSX.Element {
  return (
    <Navbar variant="dark" bg="dark" expand="lg" className="justify-content-between">
      <Link href="/" passHref>
        <Navbar.Brand>Reroll</Navbar.Brand>
      </Link>
      <InputGroup className="animate">
        <Form.Control type="text" placeholder="Search everything..." />
        <InputGroup.Append>
          <Button variant="secondary"><MdSearch /></Button>
        </InputGroup.Append>
      </InputGroup>
    </Navbar>
  );
}

export default HeaderBar;

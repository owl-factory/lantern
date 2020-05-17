import React from "react";
import { Navbar, Button, InputGroup, Form } from "react-bootstrap";
import { MdSearch } from "react-icons/md";
import Link from "next/link";

function HeaderBar() {
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
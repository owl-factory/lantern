import React from "react";
import { Navbar, Button, InputGroup, Form } from "react-bootstrap";
import { MdSearch } from "react-icons/md";

function HeaderBar() {
  return (
    <Navbar variant="dark" bg="dark" expand="lg" className="justify-content-between">
      <Navbar.Brand href="#home">Reroll</Navbar.Brand>
      <Form inline>
        <InputGroup>
          <Form.Control type="text" placeholder="Search everything..." />
          <InputGroup.Append>
            <Button variant="success"><MdSearch /></Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
    </Navbar>
  );
}

export default HeaderBar;
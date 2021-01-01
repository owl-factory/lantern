import React from "react";
import { Accordion, Button, Row } from "react-bootstrap";

function AccordionToggle(props: any) {
  const label = props.molecule.staticValues.label || undefined;
  return (
    <Accordion.Toggle as={Button} variant="link" eventKey="0">
      {label}
    </Accordion.Toggle>
  )
}

export function AccordionMolecule(props: any) {
  return (
    <Accordion>
      <Accordion.Collapse eventKey="0">
        <Row>
          {props.children}
        </Row>
      </Accordion.Collapse>
      <AccordionToggle molecule={props.molecule}/>
    </Accordion>
  );
}
import React from "react";
import { Accordion, Button, Row } from "react-bootstrap";

/**
 * Renders the accordion toggle for the molecule accordion
 * @param props.molecule The molecule in question being rendered
 */
function AccordionToggle(props: any) {
  const label = props.molecule.staticValues.label || undefined;
  return (
    <Accordion.Toggle as={Button} variant="link" eventKey="0">
      {label}
    </Accordion.Toggle>
  );
}

/**
 * Renders the accordion molecule around atoms
 *
 * @param props.children The children of the molecule
 * @param props.molecule The molecule object to render
 */
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

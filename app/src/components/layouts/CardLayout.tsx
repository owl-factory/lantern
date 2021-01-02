import { Content, ContentType, GameSystem } from "@reroll/model/dist/documents";
import React from "react";
import { Card } from "react-bootstrap";
import { Atom, Molecule } from "./Layouts";
import { DynamicMolecule } from "./molecules";

interface CardLayoutProps {
  content: Content;
  contentType: ContentType;
  rules: any;
}


function CardLayoutHeader(props: any) {
  const headerItems: JSX.Element[] = [];
  props.contentType.layout.header.forEach((molecule: Molecule | Atom) => {
    headerItems.push(
      <DynamicMolecule 
        molecule={molecule}
        data={props.data}
      />
    )
  });
  return (
    <Card.Header>
      {headerItems}
    </Card.Header>
  )
}

function CardLayoutBody(props: any) {
  const bodyItems: JSX.Element[] = [];
  props.contentType.layout.body.forEach((molecule: Molecule | Atom) => {
    bodyItems.push(
      <DynamicMolecule 
        molecule={molecule}
        data={props.data}
      />
    )
  });

  return (
    <Card.Body>
      {bodyItems}
    </Card.Body>
  );
}

export function CardLayout(props: CardLayoutProps) {
  const data = {
    content: props.content
  };
  // console.log(props)
  return (
    <Card>
      <CardLayoutHeader {...props} data={data}/>
      <CardLayoutBody {...props} data={data}/>
    </Card>
  );
}
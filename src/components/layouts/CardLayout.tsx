import React from "react";
import { DynamicMolecule } from "components/layouts";
import { Atom, Molecule } from "types/layouts";
import { Card, CardBody, CardHeader } from "components/style/card";

// The props for the base Card Layout
interface CardLayoutProps {
  content: any;
  contentType: any;
  rules: any;
}

// The props for the Card Layout Header and Body.
interface CardLayoutChildProps {
  contentType: any;
  data: {
    content: any;
  }
}

/**
 * Renders the header of a content card
 * @param props.contentType The content type that contains the layout
 * @param props.data Contains all dynamic data that may be used in the header
 */
function CardLayoutHeader(props: CardLayoutChildProps) {
  const headerItems: JSX.Element[] = [];
  props.contentType.layout?.header.forEach((molecule: Molecule | Atom) => {
    headerItems.push(
      <DynamicMolecule
        molecule={molecule}
        data={props.data}
      />
    );
  });
  return (
    <CardHeader>
      {headerItems}
    </CardHeader>
  );
}

/**
 * Renders the header of a content card
 * @param props.contentType The content type that contains the layout
 * @param props.data Contains all dynamic data that may be used in the header
 */
function CardLayoutBody(props: CardLayoutChildProps) {
  const bodyItems: JSX.Element[] = [];
  props.contentType.layout?.body.forEach((molecule: Molecule | Atom) => {
    bodyItems.push(
      <DynamicMolecule
        molecule={molecule}
        data={props.data}
      />
    );
  });

  return (
    <CardBody>
      {bodyItems}
    </CardBody>
  );
}

/**
 * Renders the full card layout
 *
 * @param props.content The specific content that we're rendering
 * @param props.contentType The type of content that we're rendering. Contains the layout
 * @param props.rules Any additional data that is global for the ruleset
 */
export function CardLayout(props: CardLayoutProps) {
  const data = {
    content: props.content,
  };

  return (
    <Card>
      <CardLayoutHeader {...props} data={data}/>
      <CardLayoutBody {...props} data={data}/>
    </Card>
  );
}

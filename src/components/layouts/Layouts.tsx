
import React from "react";
import { Formik, Form as FormikForm } from "formik";
import { Button, Card, Col, Container, Form, Nav, Row, Tab } from "react-bootstrap";
import { Entity } from "../../types/documents";
import { DynamicMolecule } from "./molecules";
import { Section } from "../../types/layouts/section";
import { Atom, Molecule, Page } from "../../types/layouts";

// Props for the base dynamic layout
interface DynamicLayoutProps {
  entity: Entity;
  onSubmit?: (values: Record<string, unknown>) => void;
}

/**
 * Renders the dynamic subsection.
 * TODO - continue to flesh out
 */
function DynamicSubsection(props: any) {
  const contents: JSX.Element[] = [];

  if (props.subsection === undefined) { return <></>; }

  props.subsection.molecules.forEach((molecule: Molecule | Atom) => {
    contents.push(<DynamicMolecule molecule={molecule} data={props.data}/>);
  });


  return (
    <Col {...props.subsection.w}>
      <Card id={props.subsection.name}>
        <Card.Body style={{ minHeight: `${props.subsection.h}em` }}>
          <Row>
            {contents}
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
}

/**
 * Renders the Dynamic Section.
 * TODO - remove or clean up in future work?
 */
export function DynamicSection(props: any) {
  const subsections: JSX.Element[] = [];
  props.section.subsections.forEach((subsectionKey: string) => {
    const subsection = props.subsections[subsectionKey] || "";
    if (subsection.name === undefined) { subsection.name = subsectionKey; }
    subsections.push(<DynamicSubsection subsection={subsection}/>);
  });

  return (
    <Col {...props.section.w} style={{padding: "7.5px"}}>
      <Card style={{backgroundColor: "#ffa1a2", minHeight: `${props.section.h}em`} }>
        <Card.Body style={{backgroundColor: "transparent"}}>
          <Row>
            {subsections}
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
}

/**
 * Renders a single dynamic page out into useable JSX
 * @param props.page The dynamic page to render
 */
function DynamicPage(props: any) {
  const sections: JSX.Element[] = [];

  props.page.sections.forEach((section: Section) => {
    sections.push(<DynamicSection section={section}/>);
  });

  return (
    <Tab.Pane eventKey={props.page.name}>
      <Container>
        <Row>
        { sections }
        </Row>
      </Container>
    </Tab.Pane>
  );
}

/**
 * Wraps the dynamic form with a wrapper
 * TODO - remove?
 */
export function DynamicFormWrapper(props: any) {
  if (props.onSubmit == undefined) {
    throw Error("This dynamic layout requires an onSubmit action.");
  }

  return (
    <Formik
      initialValues={props.entity || {}}
      onSubmit={props.onSubmit}
    >
      {() => (
        <FormikForm>
          { props.children }
        </FormikForm>
      )}
    </Formik>
  );
}

/**
 * Renders all pages for a single dynamic layout. Information about the pages is taken
 * from the props of the full dynamic layout
 */
export function DynamicPages(props: any) {
  const dynamicPages: JSX.Element[] = [];

  props.dynamicLayout.pages.forEach((page: Page) => {
    dynamicPages.push(
      <DynamicPage page={page}/>
    );
  });


  return <Tab.Content>{dynamicPages}</Tab.Content>;
}

/**
 * Renders the tabs for the dynamic layout and it's pages. Renders nothing if there
 * is only one page
 * @param props.dynamicLayout The core information about the dynamic layout
 */
function DynamicTabs(props: any) {
  if (props.dynamicLayout.pages.length <= 1) { return null; }

  const tabs: JSX.Element[] = [];
  props.dynamicLayout.pages.forEach((page: Page) => {
    tabs.push(
      <Nav.Item key={page.name}>
        <Nav.Link eventKey={page.name}>{page.name}</Nav.Link>
      </Nav.Item>
    );
  });

  return (
    <Nav>
      { tabs }
    </Nav>
  );
}

/**
 * Renders the dynamic pages for a given layout populated with the specific game's information and
 * relevant entity variables
 */
export default function DynamicLayout(props: DynamicLayoutProps) {
  // const defaultActiveKey = props.dynamicLayout.defaultPageKey || props.dynamicLayout.pages[0].name;

  return (
    <Tab.Container defaultActiveKey={"defaultActiveKey"}>
      {/* <DynamicTabs dynamicLayout={props.dynamicLayout}/>
      <DynamicFormWrapper dynamicLayout={props.dynamicLayout} entity={props.entity} onSubmit={props.onSubmit}>
        <DynamicPages dynamicLayout={props.dynamicLayout}/>
      </DynamicFormWrapper> */}
    </Tab.Container>
  );
}


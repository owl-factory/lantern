
import React from "react";
import { Formik, Form as FormikForm } from "formik";
import { Card, Col, Container, Row, Tab, Nav, Form, Button } from "react-bootstrap";
import { Error as FormError, Input, Multiselect } from "../design/forms/Forms";
import { Entity } from "@reroll/model/dist/documents";
import { DynamicAtom } from "./Atoms";
import { DynamicMolecule, MoleculeType } from "./molecules";

export enum AtomType {
  TextInput,
  MultiselectInput,
  Submit,
}

type WidthOptions = 12 | 8 | 6 | 4 | 3 | 2 | 1;

export interface Width {
  xs: WidthOptions;
  sm?: WidthOptions;
  md?: WidthOptions;
  lg?: WidthOptions;
  xl?: WidthOptions;
}

type DisplayValues = "none" | "inline" | "inline-block" | "block" | "table" | "table-cell" | "table-row" | "flex" | "inline-flex";

export interface Display {
  xs?: DisplayValues;
  sm?: DisplayValues;
  md?: DisplayValues;
  lg?: DisplayValues;
  xl?: DisplayValues;
}

export interface Atom {
  type: AtomType;
  w?: Width;
  display?: Display;
  style?: Record<string, string>;
  staticValues?: Record<string, string>;
  dynamicValues?: Record<string, string>;
}

export interface Molecule {
  type: MoleculeType;
  atoms: Atom[];
  staticValues?: Record<string, string>;
  dynamicValues?: Record<string, string>;
}

export interface Subsection {
  name?: string;
  description?: string;
  w?: Width;
  h: number;
  molecules: (Molecule | Atom)[];
}

export interface Section {
  name?: string;
  description?: string;
  w: Width;
  h: number;
  subsections: string[];
}

interface Page {
  name?: string;
  description?: string;
  sections: Section[];
}

interface DynamicLayout {
  name: string; 
  defaultPageKey?: string;
  pages: Page[];
  isStatic: boolean;
}

// const dynamicLayout: DynamicLayout = {
//   name: "Test Layout",
//   pages: [
//     { name: "Character", sections: [
//       { w: { xs: 12 }, h: 10, subsections: [] },
//       { w: { md: 1, xs: 12 }, h: 45, subsections: [] },
//       { w: { md: 3, xs: 12 }, h: 45, subsections: [ 
//         {h: 5, contents:[ {components: [
//           {type: "checkbox"},
//           {type: "text", value: "Inspiration"},
//         ] }]}, 
//         {h: 5, contents:[ {components: [
//           {type: "numberInput", style: { width: "3em" }},
//           {type: "text", value: "Proficiency"},
//         ] }]}, 
//         {h: 15, contents:[]},
//         {h: 15, contents:[]} 
//       ] },
//       { w: { md: 4, xs: 12 }, h: 45, subsections: [] },
//       { w: { md: 4, xs: 12 }, h: 45, subsections: [] },
//     ] },
//     { name: "Spells", sections: [

//     ]}
//   ]
// }

// const layoutTest: Section[] = [
//   { w: { xs: 12 }, h: 10, subsections: [] },
//   { w: { md: 1, xs: 12 }, h: 45, subsections: [] },
//   { w: { md: 3, xs: 12 }, h: 45, subsections: [ 
//     {h: 5, contents:[ {components: [
//       {type: "checkbox"},
//       {type: "text", value: "Inspiration"},
//     ] }]}, 
//     {h: 5, contents:[ {components: [
//       {type: "numberInput", style: { width: "3em" }},
//       {type: "text", value: "Proficiency"},
//     ] }]}, 
//     {h: 15, contents:[]},
//     {h: 15, contents:[]} 
//   ] },
//   { w: { md: 4, xs: 12 }, h: 45, subsections: [] },
//   { w: { md: 4, xs: 12 }, h: 45, subsections: [] },
// ];

interface DynamicLayoutProps {
  dynamicLayout: DynamicLayout;
  entity: Entity;
  onSubmit?: (values: Record<string, unknown>) => void;
}

// const tmpSubsections: Record<string, Subsection> = {   
//   name: {h: 2, w: { xs: 12, md: 6 }, contents: [
//     { components: [
//       { type: "input", variable: "name" }
//     ] }
//   ]},
//   inspiration: {h: 5, contents:[ {components: [
//     {type: "checkbox"},
//     {type: "text", value: "Inspiration"},
//   ] }]}, 
//   proficiency: {h: 5, contents:[ {components: [
//     {type: "numberInput", style: { width: "3em" }},
//     {type: "text", value: "Proficiency"},
//   ] }]}
// };

export function RenderError(props: any) {
  return (
    <Col {...(props.w || {}) } style={{color: "red", fontWeight: "bold"}}>
      {props.errors}
    </Col>
  )
}

function fetchValue(props: any) {

}

function DynamicSubsection(props: any) {
  const contents: JSX.Element[] = [];

  if (props.subsection === undefined) { return <></>; }
  
  props.subsection.molecules.forEach((molecule: Molecule | Atom) => {
    contents.push(<DynamicMolecule molecule={molecule}/>);
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

export function DynamicSection(props: any) {
  const subsections: JSX.Element[] = [];
  props.section.subsections.forEach((subsectionKey: string) => {
    const subsection = props.subsections[subsectionKey] || "";
    if (subsection.name === undefined) { subsection.name = subsectionKey };
    subsections.push(<DynamicSubsection subsection={subsection}/>)
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
    sections.push(<DynamicSection section={section}/>)
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
 * 
 * @param props 
 */
export function DynamicFormWrapper(props: any) {
  if (props.onSubmit == undefined) { 
    throw Error("This dynamic layout requires an onSubmit action.")
  };

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
  const defaultActiveKey = props.dynamicLayout.defaultPageKey || props.dynamicLayout.pages[0].name;

  return (
    <Tab.Container defaultActiveKey={defaultActiveKey}>
      <DynamicTabs dynamicLayout={props.dynamicLayout}/>
      <DynamicFormWrapper dynamicLayout={props.dynamicLayout} entity={props.entity} onSubmit={props.onSubmit}>
        <DynamicPages dynamicLayout={props.dynamicLayout}/>
      </DynamicFormWrapper>
    </Tab.Container>
  );
}


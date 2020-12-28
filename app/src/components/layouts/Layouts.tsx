
import React from "react";
import { Formik, Form as FormikForm } from "formik";
import { Card, Col, Container, Row, Tabs, Tab, Nav } from "react-bootstrap";
import { Error as FormError, Input } from "../design/forms/Forms";
import { Entity } from "@reroll/model/dist/documents";

type WidthOptions = 12 | 8 | 6 | 4 | 3 | 2 | 1;

interface Width {
  xs: WidthOptions;
  sm?: WidthOptions;
  md?: WidthOptions;
  lg?: WidthOptions;
  xl?: WidthOptions;
}

interface Component {
  type: string;
  style?: Record<string, string>;
  value?: string;
}

interface Content {
  components: Component[];
}

interface Subsection {
  name?: string;
  description?: string;
  w?: Width;
  h: number;
  contents: Content[];
}

interface Section {
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

const tmpSubsections: Record<string, Subsection> = {   
  name: {h: 2, w: { xs: 12, md: 6 }, contents: [
    { components: [
      { type: "input", variable: "name" }
    ] }
  ]},
  inspiration: {h: 5, contents:[ {components: [
    {type: "checkbox"},
    {type: "text", value: "Inspiration"},
  ] }]}, 
  proficiency: {h: 5, contents:[ {components: [
    {type: "numberInput", style: { width: "3em" }},
    {type: "text", value: "Proficiency"},
  ] }]}
};


function DynamicComponent(props: any): JSX.Element {
  switch(props.component.type) {
    case "checkbox":
      return <input type="checkbox"/>;
    case "input":

      return (
        <>
          <Input name={props.component.variable} />
          <FormError name={props.component.variable} />
        </>
      );
    case "numberInput":
      return <input type="number" style={props.component.style} />;
    case "text":
      return <div>{props.component.value}</div>
  }
  return <></>;
}


function DynamicContent(props: any) {
  const components: JSX.Element[] = [];

  props.content.components.forEach((component: Component) => {
    components.push(<DynamicComponent component={component}/>);
  });

  return <>{components}</>;
}

function DynamicSubsection(props: any) {
  const contents: JSX.Element[] = [];
  console.log(props.subsection)
  const subsection: Subsection = tmpSubsections[props.subsection];

  if (subsection === undefined) { return <></>; }
  
  subsection.contents.forEach((content: Content) => {
    contents.push(<DynamicContent content={content}/>);
  });


  return (
    <Col {...subsection.w}>
      <Card >
        <Card.Body style={{ minHeight: `${subsection.h}em` }}>
          {contents}
        </Card.Body>
      </Card>
    </Col>
  );
}

function DynamicSection(props: any) {
  const subsections: JSX.Element[] = [];
  props.section.subsections.forEach((subsection: string) => {
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
function DynamicForm(props: any) {
  if (props.dynamicLayout.isStatic) { return <>{props.children}</>; }
  if (props.onSubmit == undefined) { 
    throw Error("The Dynamic Layout requires an onSubmit action for non-static layouts.")
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
function DynamicPages(props: any) {
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
      <DynamicForm dynamicLayout={props.dynamicLayout} entity={props.entity} onSubmit={props.onSubmit}>
        <DynamicPages dynamicLayout={props.dynamicLayout}/>
      </DynamicForm>
    </Tab.Container>
  );
}
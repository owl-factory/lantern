
import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

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
  h: number;
  contents: Content[];
}

interface Section {
  name?: string;
  description?: string;
  w: Width;
  h: number;
  subsections: Subsection[];
}

const layoutTest: Section[] = [
  { w: { xs: 12 }, h: 10, subsections: [] },
  { w: { md: 1, xs: 12 }, h: 45, subsections: [] },
  { w: { md: 3, xs: 12 }, h: 45, subsections: [ 
    {h: 5, contents:[ {components: [
      {type: "checkbox"},
      {type: "text", value: "Inspiration"},
    ] }]}, 
    {h: 5, contents:[ {components: [
      {type: "numberInput", style: { width: "3em" }},
      {type: "text", value: "Proficiency"},
    ] }]}, 
    {h: 15, contents:[]},
    {h: 15, contents:[]} 
  ] },
  { w: { md: 4, xs: 12 }, h: 45, subsections: [] },
  { w: { md: 4, xs: 12 }, h: 45, subsections: [] },
];

function buildComponent(component: Component): JSX.Element {
  switch(component.type) {
    case "checkbox":
      return <input type="checkbox"/>;
    case "numberInput":
      return <input type="number" style={component.style} />;
    case "text":
      return <div>{component.value}</div>
  }
  return <></>;
}

function buildComponents(layoutComponents: Component[]) {
  const components = [];

  layoutComponents.forEach((layoutComponent: Component) => {
    components.push(buildComponent(layoutComponent));
  });

  return components;
}

function buildContents(layoutContents: Content[]) {
  const contents = [];

  layoutContents.forEach((content: Content) => {
    const components = buildComponents(content.components);
    contents.push(
      <>{components}</>
    )
  });

  return contents;
}

function buildSubsections(layoutSubsections: Subsection[]) {
  const subsections = [];

  layoutSubsections.forEach((subsection: Subsection) => {
    const contents = buildContents(subsection.contents)
    subsections.push(
      <Card style={{ minHeight: `${subsection.h}em` }}>
        <Card.Body >
          {contents}
        </Card.Body>
      </Card>
    )
  });

  return subsections;
}

function buildSections(layoutSections: Section[]) {
  const sections = [];

  layoutSections.forEach((section: Section) => {
    const subsections = buildSubsections(section.subsections)
    sections.push(
      <Col {...section.w} style={{padding: "7.5px"}}>
        <Card style={{backgroundColor: "#ffa1a2", minHeight: `${section.h}em`} }>
          <Card.Body style={{backgroundColor: "transparent"}}>
            {subsections}
          </Card.Body>
        </Card>
      </Col>
    );
  });
  
  return sections;
}

export default function DynamicLayout(props: any) {
  const sections = buildSections(layoutTest);

  return(
    <Card style={{backgroundColor: "#daf0f5", minHeight: "auto"}}>
      <Card.Body>
        <Container  >
          <Row>
            {sections}
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
}
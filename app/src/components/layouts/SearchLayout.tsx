import React from "react";
import { Tab } from "react-bootstrap";
import { DynamicFormWrapper, DynamicSection, Section } from "./Layouts";

export default function SearchLayout(props: any) {
  const sections: JSX.Element[] = [];
  let index = 0;
  
  props.searchLayout.form.forEach((section: Section) => {
    sections.push(
      <DynamicSection 
        key={`search_section_${index}`}
        section={section}
        subsections={props.searchLayout.subsections}
      />
    )
    index++;
  });

  return (
    <Tab.Container>
      <DynamicFormWrapper onSubmit={props.onSubmit}>
        {sections}
      </DynamicFormWrapper>

      {/* Results */}
    </Tab.Container>
  )
}
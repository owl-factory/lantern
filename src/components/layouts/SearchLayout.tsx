import React from "react";
import { Tab } from "react-bootstrap";
import { Section } from "types/layouts";
import { DynamicFormWrapper, DynamicSection } from "./Layouts";

/**
 * Renders the search layout.
 * TODO - finish this at a later point. This is merely a placeholder
 */
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
    );
    index++;
  });

  return (
    <Tab.Container>
      <DynamicFormWrapper onSubmit={props.onSubmit}>
        {sections}
      </DynamicFormWrapper>

      {/* Results */}
      {/* TODO - need to look at react-bootstrap-table2 */}
    </Tab.Container>
  );
}

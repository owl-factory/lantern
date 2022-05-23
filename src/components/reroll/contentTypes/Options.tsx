import React from "react";
import { observer } from "mobx-react-lite";
import { ContentTypeData } from "controllers/data/ContentTypeData";
import { SearchParams } from "@owl-factory/data/types";

/**
 * Renders a list of content type select options by loading in data determined by the given parameters
 */
export const ContentTypeOptions = observer((props: { parameters?: SearchParams }) => {
  const options: JSX.Element[] = [];

  options.push(<option key="" value="">-- Select a Content Type --</option>);

   // Loads in the ruleset options
   const contentTypes = ContentTypeData.search(props.parameters);
   for (const contentTypeRef of contentTypes) {
     const contentType = ContentTypeData.get(contentTypeRef);
     if (!contentType) { continue; }
     options.push(<option key={contentType.ref} value={contentType.ref}>{contentType.name}</option>);
   }
  return (
    <>
      {options}
    </>
  );
});

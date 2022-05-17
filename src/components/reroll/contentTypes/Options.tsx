import React from "react";
import { observer } from "mobx-react-lite";
import { ContentTypeData } from "controllers/data/ContentTypeData";


export const ContentTypeOptions = observer((props: any) => {
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

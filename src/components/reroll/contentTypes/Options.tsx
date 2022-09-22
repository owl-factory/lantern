import React from "react";
import { observer } from "mobx-react-lite";

/**
 * Renders a list of content type select options by loading in data determined by the given parameters
 */
export const ContentTypeOptions = observer(() => {
  const options: JSX.Element[] = [];

  options.push(<option key="" value="">-- Select a Content Type --</option>);
  return (
    <>
      {options}
    </>
  );
});

import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { OptionDescriptor } from "nodes/view-renderer/types/elements";
import React from "react";
import { SheetElementProps } from "../../../types";

const VARIABLE_FIELDS = ["value", "text"];

/**
 * Renders an option element
 * @param element The option element description
 */
export const SheetOption = observer((props: SheetElementProps<OptionDescriptor>) => {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<OptionDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  return (
    <option value={element.value}>
      {element.text}
    </option>
  );
});

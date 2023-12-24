import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { OptionAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";

/**
 * Renders an option for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export const ViewOption = observer((props: RenderProps<OptionAttributes>) => {
  const sources = ViewRenderer.renders[props.renderID].sources;

  const [ text, setText ] = React.useState("");
  const [ value, setValue ] = React.useState("");

  // Text
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.text, props.properties).then((res: string) => { setText(res); });
  }, fetchExpressionValues(sources, props.element.attributes.text) as unknown[]);

  // Values
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.value, props.properties).then((res: string) => { setValue(res); });
  }, fetchExpressionValues(sources, props.element.attributes.value) as unknown[]);


  return (
    <option value={value}>
      {text}
    </option>
  );
});

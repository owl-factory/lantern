import { observer } from "mobx-react-lite";
import { ActiveData } from "nodes/active-data";
import { ViewRenderer } from "nodes/view-renderer";
import { RadioAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";

/**
 * Renders a radio button for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export const ViewRadio = observer((props: RenderProps<RadioAttributes>) => {
  const ref = React.createRef<HTMLInputElement>();
  const sources = ViewRenderer.renders[props.renderID].sources;

  const [ className, setClassName ] = React.useState("");
  const [ id, setID ] = React.useState("");
  const [ name, setName ] = React.useState("");
  const [ value, setValue ] = React.useState("");

  // Class Name
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.className, props.properties).then((res: string) => {
      setClassName(res);
    });
  }, fetchExpressionValues(sources, props.element.attributes.className) as unknown[]);

  // ID
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.id, props.properties).then((res: string) => { setID(res); });
  }, fetchExpressionValues(sources, props.element.attributes.id) as unknown[]);

  // Name
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.name, props.properties).then((res: string) => { setName(res); });
  }, fetchExpressionValues(sources, props.element.attributes.name) as unknown[]);

  // Values
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.value, props.properties).then((res: string) => { setValue(res); });
  }, fetchExpressionValues(sources, props.element.attributes.value) as unknown[]);

  let fieldValue;
  if (sources.actorID && name) fieldValue = ActiveData.getActor(sources.actorID, name);

  /**
   * Handles the onChange event in the radio buttons. Updates the ActorController values
   * @param ev The triggering onChange event
   */
  function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
    ActiveData.setActor(props.renderID, name, ev.target.value);
    ev.target.checked = true;
  }

  return (
    <input
      type="radio"
      ref={ref}
      id={id}
      name={name}
      className={`input radio-button ${className}`}
      defaultChecked={fieldValue === value}
      onChange={onChange}
      value={value}
    />
  );
});

import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { CheckboxAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { getActorValue, setActorValue } from "nodes/view-renderer/utilities/render/actor";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";

/**
 * Renders a checkbox for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export const ViewCheckbox = observer((props: RenderProps<CheckboxAttributes>) => {
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

  // The actor source is required
  const actorID = ViewRenderer.renders[props.renderID].sources.actorID;
  if (!actorID) { return <></>; }

  const key = generateCheckboxName(name, value);
  const checked = !!getActorValue(sources.actorID, name, props.properties);


  /**
   * Handles the onChange event in the radio buttons. Updates the ActorController values
   * @param ev The triggering onChange event
   */
  function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
    if (!actorID) return;
    setActorValue(sources.actorID, name, props.properties, ev.target.checked);
    ev.target.checked = !!getActorValue(sources.actorID, name, props.properties);
  }

  // Handles the case where we have two or more elements of the same name, and one of them is changed
  // This updates the input values so that we are consistent
  React.useEffect(() => {
    if (!ref.current) { return; }
    if (ref.current === document.activeElement) { return; }
    ref.current.checked = !!getActorValue(sources.actorID, name, props.properties);
  }, [getActorValue(sources.actorID, name, props.properties)]);


  return (
    <input
      type="checkbox"
      id={id}
      ref={ref}
      className={`checkbox ${className}`}
      name={name}
      defaultChecked={checked}
      onChange={onChange}
    />
  );
});

/**
 * Generates the name of the field that the checkbox input will be saved as, rather than doing multiple layers
 * @param name The name of the checkbox input
 * @param value The value (if any) of the checkbox input
 * @returns The generated name of the checkbox input
 */
 function generateCheckboxName(name: string, value?: string) {
  if (name && value) return `${name}/${value}`;
  return `${name}`;
}

import { observer } from "mobx-react-lite";
import { ActiveData } from "nodes/active-data";
import { ViewRenderer } from "nodes/view-renderer";
import { TextAreaAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { getActorValue, setActorValue } from "nodes/view-renderer/utilities/render/actor";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";

/**
 * Renders a text area for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export function ViewTextArea(props: RenderProps<TextAreaAttributes>) {
  const ref = React.createRef<HTMLTextAreaElement>();
  const sources = ViewRenderer.renders[props.renderID].sources;
  let defaultValue;

  const [ className, setClassName ] = React.useState("");
  const [ id, setID ] = React.useState("");
  const [ name, setName ] = React.useState("");

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


  /**
   * Updates the ActiveData to have the changed values
   * @param ev The triggering onChange event
   */
  function onChange(ev: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!sources.actorID) return;
    setActorValue(sources.actorID, name, props.properties, ev.target.value);
    ev.target.value = (getActorValue(sources.actorID, name, props.properties) || "").toString();
  }

  // Handles the case where we have two or more elements of the same name, and one of them is changed
  // This updates the input values so that we are consistent
  React.useEffect(() => {
    if (!ref.current || !sources.actorID) { return; }
    if (ref.current === document.activeElement) { return; }
    ref.current.value = (getActorValue(sources.actorID, name, props.properties) || "").toString();
  }, [ActiveData.getActor(sources.actorID || "", name)]);

  if (sources.actorID) { defaultValue = (getActorValue(sources.actorID, name, props.properties) || "").toString(); }

  return (
    <div>
      <textarea
        ref={ref}
        id={id}
        name={name}
        onChange={onChange}
        className={`input textarea ${className}`}
        rows={4}
        value={(getActorValue(sources.actorID, name, props.properties) || "").toString()}
      />
    </div>
  );
}

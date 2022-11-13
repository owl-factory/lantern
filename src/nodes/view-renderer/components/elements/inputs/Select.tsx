import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { SelectAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { getActorValue, setActorValue } from "nodes/view-renderer/utilities/render/actor";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";
import { ViewChildren } from "../utility";

/**
 * Renders a select input for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export const ViewSelect = observer((props: RenderProps<SelectAttributes>) => {
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
   * Updates the ActorController to have the changed values
   * @param ev The triggering onChange event
   */
   function onChange(ev: React.ChangeEvent<HTMLSelectElement>) {
    if (!sources.actorID) { return; }
    setActorValue(sources.actorID, name, props.properties, ev.target.value);
    ev.target.value = (getActorValue(sources.actorID, name, props.properties) || "").toString();
  }

  if (sources.actorID) { defaultValue = (getActorValue(sources.actorID, name, props.properties) || "").toString(); }

  return (
    <select
      id={id}
      name={name}
      className={`select ${className}`}
      defaultValue={defaultValue}
      onChange={onChange}
    >
      <ViewChildren renderID={props.renderID} elements={props.element.children || []} properties={props.properties}/>
    </select>
  );
});

import { observer } from "mobx-react-lite";
import { ActiveData } from "nodes/active-data";
import { ViewRenderer } from "nodes/view-renderer";
import { InputAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";

/**
 * Renders an input for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export const ViewInput = observer((props: RenderProps<InputAttributes>) => {
  const ref = React.createRef<HTMLInputElement>();
  const sources = ViewRenderer.renders[props.renderID].sources;
  const type = props.element.attributes.type;
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

  if (sources.actorID) (ActiveData.getActor(sources.actorID, name) || "").toString();

  /**
   * Updates the ActorController to have the changed values
   * @param ev The triggering onChange event
   */
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!sources.actorID) { return; }
    ActiveData.setActor(sources.actorID, name, e.target.value);
    e.target.value = (ActiveData.getActor(sources.actorID, name) || "").toString();
  }

  return (
    <div>
      <input
        ref={ref}
        id={id}
        type={type}
        name={name}
        className={`input ${type}-input ${className}`}
        onChange={onChange}
        autoComplete="off"
        defaultValue={defaultValue}
      />
    </div>
  );
});

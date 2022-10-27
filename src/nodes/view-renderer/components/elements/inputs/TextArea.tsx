import { observer } from "mobx-react-lite";
import { ActiveData } from "nodes/active-data";
import { ViewRenderer } from "nodes/view-renderer";
import { TextAreaAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
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
  const [ value, setValue ] = React.useState("");

  /**
   * Updates the ActiveData to have the changed values
   * @param ev The triggering onChange event
   */
  function onChange(ev: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!sources.actorID) return;
    ActiveData.setActor(sources.actorID, name, ev.target.value);
    ev.target.value = (ActiveData.getActor(sources.actorID, name) || "").toString();
  }

  // Handles the case where we have two or more elements of the same name, and one of them is changed
  // This updates the input values so that we are consistent
  React.useEffect(() => {
    if (!ref.current || !sources.actorID) { return; }
    if (ref.current === document.activeElement) { return; }
    ref.current.value = (ActiveData.getActor(sources.actorID, name) || "").toString();
  }, [ActiveData.getActor(sources.actorID || "", name)]);

  if (sources.actorID) { defaultValue = (ActiveData.getActor(sources.actorID, name) || "").toString(); }

  return (
    <div>
      <textarea
        ref={ref}
        id={id}
        name={name}
        onChange={onChange}
        className={`input textarea ${className}`}
        rows={4}
        defaultValue={defaultValue}
      />
    </div>
  );
}

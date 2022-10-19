import React from "react";
import { SheetChildren } from "../utility/Children";
import { observer } from "mobx-react-lite";
import { SheetElementProps } from "nodes/view-renderer/types";
import { SelectDescriptor } from "nodes/view-renderer/types/elements";
import { ViewRenderer } from "nodes/view-renderer";

const VARIABLE_FIELDS = ["className", "id", "name"];

/**
 * Renders a select input element
 * @param element The select element description
 */
export const SheetSelect = observer((props: SheetElementProps<SelectDescriptor>) => {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<SelectDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  /**
   * Updates the ActorController to have the changed values
   * @param ev The triggering onChange event
   */
   function onChange(ev: React.ChangeEvent<HTMLSelectElement>) {
    // ActorController.setActor(props.renderID, element.name, props.properties, ev.target.value);
    // ev.target.value = ActorController.getActor(props.renderID, element.name, props.properties).toString();
  }

  return (
    <select
      name={element.name}
      className={`select ${element.className}`}
      // defaultValue={ActorController.getActor(props.renderID, element.name, props.properties).toString()}
      onChange={onChange}
    >
      <SheetChildren {...props}/>
    </select>
  );
});

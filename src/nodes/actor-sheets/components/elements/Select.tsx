import { ActorController } from "../../controllers/ActorSheetController";
import React from "react";
import { SelectDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "nodes/actor-sheets/types";
import { SheetChildren } from "./Children";
import { observer } from "mobx-react-lite";

const VARIABLE_FIELDS = ["id", "name"];

/**
 * Renders a select input element
 * @param element The select element description
 */
export const SheetSelect = observer((props: SheetElementProps<SelectDescriptor>) => {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ActorController.renderExpressions<SelectDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
    ).then(setElement);
  }, []);

  /**
   * Updates the ActorController to have the changed values
   * @param ev The triggering onChange event
   */
   function onChange(ev: React.ChangeEvent<HTMLSelectElement>) {
    ActorController.setActor(props.renderID, element.name, props.properties, ev.target.value);
    ev.target.value = ActorController.getActor(props.renderID, element.name, props.properties).toString();
  }

  return (
    <select
      name={element.name}
      className={`select`}
      defaultValue={ActorController.getActor(props.renderID, element.name, props.properties).toString()}
      onChange={onChange}
    >
      <SheetChildren {...props}/>
    </select>
  );
});

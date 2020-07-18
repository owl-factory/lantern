import React from "react";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import { ContextMenuGenericItem, ContextMenuItem, ContextMenuLink } from "../../../models/design/contextMenu";
import Tooltip from "../Tooltip";
import ContextDropdown from "./ContextDropdown";
import ContextButtonGroup, { ContextButtons } from "./ContextButtons";

/**
 * Determines which index to split between shown and menued options
 * TODO - hash out more with mobile
 */
function determineSplit() {
  return 2;
}

function AdditionalMenu(props: any) {
  if (props.items.length == 0) {
    return <></>;
  }

  return (
    <Tooltip title="More">
      <Dropdown.Toggle split id={`dropdown-toggle-${props.context.  key}`}>...</Dropdown.Toggle>
    </Tooltip>
  );
}



export default function ContextMenuCollection(props: any) {
  const split = determineSplit();
  let buttonItems: ContextMenuGenericItem[] = [];
  let dropdownItems: ContextMenuGenericItem[] = [];
  
  if (split === 0) {
    dropdownItems = props.items;

  } else if (split >= props.items.length) {
    buttonItems = props.items;
 
  } else {
    buttonItems = props.items.slice(0, split);
    dropdownItems = props.items.slice(split);
  }

  if (dropdownItems.length === 0) {
    return <ContextButtonGroup items={buttonItems} context={props.context}/>
  }

  let contextButtons: JSX.Element | undefined = undefined;
  if (buttonItems.length > 0) {
    contextButtons = <ContextButtons items={buttonItems} context={props.context}/>
  }

  return (
    <ContextDropdown 
      as={ButtonGroup}
      context={props.context}
      {...props}
    >
      {contextButtons}
      <Tooltip title="More">
        <Dropdown.Toggle split id="dropdown-toggle">...</Dropdown.Toggle>
      </Tooltip>
    </ContextDropdown>
  );
}
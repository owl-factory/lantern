import React, { ReactNode } from "react";
import { Dropdown } from "react-bootstrap";
import { idify, def } from "../../helpers/tools";
import { ContextMenuActionType, ContextMenuItemType } from "../../models/design/contextMenu";

// The direction to drop the menu
type DropType = "up" | "down" | "left" | "right";

// Props for the ContextMenu component
interface ContextMenuProps {
  alignRight?: boolean; 
  children: ReactNode;
  context: any;
  drop?: DropType;
  items: ContextMenuItemType[];
}

// Props for the ContextMenuItem component
interface ContextMenuItemProps {
  action: ContextMenuActionType; // The action to run when clicked. May be a link or another action. Passed the context
  context: any; // Any specific context for this contextmenu, such as an object's information from a table
  icon: JSX.Element; // The icon to display on the right side of the context menu
  title: string; // The title of the item
}

/**
 * Renders a single context menu item
 * @param props.action The action to run when clicked. May be a link or another action. Passed the context 
 * @param props.context Any specific context for this contextmenu, such as an object's information from a table 
 * @param props.icon The icon to display on the right side of the context menu 
 * @param props.string The title of the item 
 */
function ContextMenuItem(props: ContextMenuItemProps) {
  return (
    <Dropdown.Item onClick={() => {props.action(props.context)}}>
      {props.title}
      <span style={{float: "right"}}>{props.icon}</span>
    </Dropdown.Item>
  )
}

/**
 * Renders a context menu
 * @param props.alignRight Align the right sides of the button and the dropdown
 * @param props.children Any children to render. <Dropdown.Toggle/> will create a button that accesses this dropdown
 * @param props.context The context for the menu, such as the current data for a table row
 * @param props.drop The direction to drop the menu
 * @param props.items The items to render
 */
export default function ContextMenu(props: ContextMenuProps) {
  const menuItems: JSX.Element[] = [];

  const alignRight = def<boolean>(props.alignRight, true);
  const drop = def<DropType>(props.drop, "down");

  props.items.forEach((item: ContextMenuItemType) => {
    if(item.header === true) {
      menuItems.push(<Dropdown.Header>{item.title}</Dropdown.Header>);

    } else if (item.divider === true) {
      menuItems.push(<Dropdown.Divider/>);

    } else if (item.title !== undefined && item.action !== undefined && item.icon !== undefined) {
      menuItems.push(
        <ContextMenuItem 
          key={"context-menu-item_" + idify(item.title)} 
          action={item.action}
          icon={item.icon}
          title={item.title}
          context={props.context}
        />
      );
    }
  });

  return (
    <Dropdown alignRight={alignRight} drop={drop} flip={true} >
      {props.children}
      <Dropdown.Menu>
        {menuItems}
      </Dropdown.Menu>
    </Dropdown>
  )
}
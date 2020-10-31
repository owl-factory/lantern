/* eslint-disable no-case-declarations */
import React from "react";
import { Dropdown } from "react-bootstrap";
import { def } from "../../../utilities/tools";
import { ContextMenuItemProps, ContextMenuLinkProps, ContextDropdownProps, DropType, ContextMenuGenericItem, ContextMenuLink, ContextMenuItem } from "../../../models/design/contextMenu";
import { useRouter } from "next/router";
import { parseHref } from "../../../utilities/design/contextMenu";


/**
 * Renders a single context dropdown item
 * @param props.action The action to run when clicked. May be a link or another action. Passed the context 
 * @param props.context Any specific context for this contextmenu, such as an object's information from a table 
 * @param props.icon The icon to display on the right side of the context menu 
 * @param props.string The title of the item 
 */
function ContextDropdownItem(props: ContextMenuItemProps) {
  return (
    <Dropdown.Item onClick={() => {props.action(props.context)}}>
      {props.title}
      <span style={{float: "right"}}><props.icon/></span>
    </Dropdown.Item>
  )
}

/**
 * Renders a Context Menu item with a linked action to streamline the frequent use of links
 * @param props.context An object containing the current context from which data may be pulled
 * @param props.href The keyed href to parse into a usable url
 * @param props.keys An object containing the keys used in the href with values of the relating key in the context
 * @param props.icon The icon to render on the right side of the context menu
 * @param props.title The title of the content menu item
 */
function ContextDropdownLink(props: ContextMenuLinkProps) {
  const router = useRouter();
  const linkAs = parseHref(props.href, props.keys, props.context);

  return (
    <ContextDropdownItem
      buttonConfig={props.buttonConfig}
      title={props.title}
      icon={props.icon}
      action={() => {router.push(props.href, linkAs)}}
      context={props.context}
    />
  );
}

/**
 * Renders a single context menu item
 * 
 * @param item A generic item type describing what and how to render an item
 * @param context The context of this current menu
 * @param keyIndex The index for this menu to use in a key
 */
function renderContextMenuItem(item: ContextMenuGenericItem, context: any, keyIndex: number) {
  const key = `context-menu-item-${keyIndex}`;

  switch(item.type) {
    case "divider":
      return <Dropdown.Divider key={key}/>;
    
    case "header":
      return <Dropdown.Header key={key}>{item.title}</Dropdown.Header>;

    case "link":
      return <ContextDropdownLink key={key} {...item as unknown as ContextMenuLink} context={context}/>
    
    case "item":
      return <ContextDropdownItem key={key} {...item as unknown as ContextMenuItem} context={context}/>;

    default:
      return <></>;
  }
}

export function ContextDropdownMenu(props: any) {
  const menuItems: JSX.Element[] = [];

  let keyIndex = 0;
  props.items.forEach((item: ContextMenuGenericItem) => {
    menuItems.push(renderContextMenuItem(item, props.context, keyIndex++));
  });

  return (
    <Dropdown.Menu>
      {menuItems}
    </Dropdown.Menu>
  );
}

/**
 * Renders a context menu
 * @param props.alignRight Align the right sides of the button and the dropdown
 * @param props.children Any children to render. <Dropdown.Toggle/> will create a button that accesses this dropdown
 * @param props.context The context for the menu, such as the current data for a table row
 * @param props.drop The direction to drop the menu
 * @param props.items The items to render
 */
export default function ContextDropdown(props: ContextDropdownProps) {

  const alignRight = def<boolean>(props.alignRight, true);
  const drop = def<DropType>(props.drop, "down");

  return (
    <Dropdown as={props.as} alignRight={alignRight} drop={drop}>
      {props.children}
      <ContextDropdownMenu {...props}/>
    </Dropdown>
  );
}
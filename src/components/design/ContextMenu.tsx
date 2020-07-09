/* eslint-disable no-case-declarations */
import React, { ReactNode } from "react";
import { Dropdown } from "react-bootstrap";
import { idify, def } from "../../helpers/tools";
import { ContextMenuActionType, ContextMenuItemType, ContextMenuLinkType,  ContextMenuGenericItemType } from "../../models/design/contextMenu";
import { IconType } from "react-icons/lib";
import Link from "next/link";
import { useRouter } from "next/router";

// The direction to drop the menu
type DropType = "up" | "down" | "left" | "right";

// Props for the ContextMenu component
interface ContextMenuProps {
  as?: any;
  alignRight?: boolean; 
  children: ReactNode;
  context: any;
  drop?: DropType;
  items: ContextMenuGenericItemType[];
}

// Props for the ContextMenuItem component
interface ContextMenuItemProps {
  action: ContextMenuActionType; // The action to run when clicked. May be a link or another action. Passed the context
  context: any; // Any specific context for this contextmenu, such as an object's information from a table
  icon: IconType; // The icon to display on the right side of the context menu
  title: string; // The title of the item
}

interface ContextMenuLinkProps {
  context: any; // Any specific context for this contextmenu, such as an object's information from a table
  href: string; 
  icon: IconType; // The icon to display on the right side of the context menu
  keys: any;
  title: string; // The title of the item
}

/**
 * Parses the raw href into a usable url
 * @param href The raw href potentially containing dynamic variables in the form `[id]`
 * @param keys An object describing how the keys from the href relate to the context
 * @param context The context of this menu from which to pull dynamic data
 */
function parseHref(href: string, keys: any, context: any) {
  let linkAs = href;
  const hrefKeys = href.match(/\[(.+?)\]/g);
  
  // Exit if no keys are found
  if (hrefKeys === null) {
    return linkAs;
  }

  // Goes through each key from the href and pulls the correct value
  hrefKeys.forEach((hrefKey: any) => {
    const cleanKey = hrefKey.slice(1, -1 );
    
    let value = "";
    if (cleanKey in keys) {
      value = context[keys[cleanKey]];
    } else {
      value = context[cleanKey];
    }

    linkAs = linkAs.replace(hrefKey, value);
  });
  
  return linkAs;
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
function ContextMenuLink(props: ContextMenuLinkProps) {
  const router = useRouter();
  const linkAs = parseHref(props.href, props.keys, props.context);

  return (
    <ContextMenuItem 
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
function renderContextMenuItem(item: ContextMenuGenericItemType, context: any, keyIndex: number) {
  const key = `context-menu-item-${keyIndex}`;

  switch(item.type) {
    case "divider":
      return <Dropdown.Divider key={key}/>;
    
    case "header":
      return <Dropdown.Header key={key}>{item.title}</Dropdown.Header>;

    case "link":
      const linkProps = item as unknown as ContextMenuLinkType;
      return <ContextMenuLink key={key} {...linkProps} context={context}/>
    
    case "item":
      const itemProps = item as unknown as ContextMenuItemType;
      return <ContextMenuItem key={key} {...itemProps} context={context}/>;

    default:
      return <></>;
  }
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

  let keyIndex = 0;
  props.items.forEach((item: ContextMenuGenericItemType) => {
    menuItems.push(renderContextMenuItem(item, props.context, keyIndex++));
  });

  return (
    <Dropdown as={props.as} alignRight={alignRight} drop={drop}>
      {props.children}
      <Dropdown.Menu>
        {menuItems}
      </Dropdown.Menu>
    </Dropdown>
  )
}
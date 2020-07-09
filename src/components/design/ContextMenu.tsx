/* eslint-disable no-case-declarations */
import React, { ReactNode } from "react";
import { Dropdown } from "react-bootstrap";
import { idify, def } from "../../helpers/tools";
import { ContextMenuActionType, ContextMenuItemType, ContextMenuLinkItemType,  ContextMenuGenericItemType } from "../../models/design/contextMenu";
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

function parseHref(href: string, keys: any, context: any) {
  let linkAs = href;
  const hrefKeys = href.match(/\[(.+?)\]/g);
  
  // Exit if no keys are found
  if (hrefKeys === null) {
    return linkAs;
  }

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

function ContextMenuLink(props: ContextMenuLinkProps) {
  const router = useRouter();
  const linkAs = parseHref(props.href, props.keys, props.context);

  return (
    <Link href={props.href} as={linkAs}>
    <ContextMenuItem title={props.title} icon={props.icon} action={() => (router.push(linkAs))} context={props.context}/>
    </Link>
  );
}

function renderContextMenuItem(item: ContextMenuGenericItemType, context: any, keyIndex: number) {
  const key = `context-menu-item-${keyIndex}`;

  switch(item.type) {
    case "divider":
      return <Dropdown.Divider key={key}/>;
    
    case "header":
      return <Dropdown.Header key={key}>{item.title}</Dropdown.Header>;

    case "link":
      const linkProps = item as unknown as ContextMenuLinkItemType;
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

  console.log()

  return (
    <Dropdown as={props.as} alignRight={alignRight} drop={drop}>
      {props.children}
      <Dropdown.Menu>
        {menuItems}
      </Dropdown.Menu>
    </Dropdown>
  )
}
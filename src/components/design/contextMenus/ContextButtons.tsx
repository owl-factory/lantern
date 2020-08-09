import React from "react";
import { ContextButtonProps, ContextMenuItemProps, ContextMenuLinkProps, ContextMenuGenericItem, ContextMenuLink, ContextMenuItem } from "../../../models/design/contextMenu";
import Tooltip from "../Tooltip";
import { Button, ButtonGroup } from "react-bootstrap";
import { useRouter } from "next/router";
import { parseHref } from "../../../helpers/design/contextMenu";

/**
 * Context Menu Buttons are split buttons created together in a singular group,
 * similar to the ContextMenu and utilizing the same functionality
 */

 /**
  * Renders a Context Button item with tooltip and on click event action
  * @param props.action The action to run on click
  * @param props.context The context for this item
  * @param props.icon The icon to render within this item
  * @param props.title The title of this item
  */
function ContextButtonItem(props: ContextMenuItemProps) {
  return (
    <Tooltip title={props.title}>
      <Button onClick={() => {props.action(props.context)}}>
        <props.icon/>
      </Button>
    </Tooltip>
  );
}

/**
 * Renders the Context Button Item with a link
 * @param props.context The specific context for this item
 * @param props.href The raw href to direct the user to
 * @param props.icon The icon to render with the item
 * @param props.keys An object with keys matching the variables in the href and linking to the context
 * @param props.title The title of the item
 */
function ContextButtonLink(props: ContextMenuLinkProps) {
  const router = useRouter();
  const linkAs = parseHref(props.href, props.keys, props.context);

  return (
    <ContextButtonItem
      title={props.title}
      icon={props.icon}
      action={() => {router.push(props.href, linkAs)}}
      context={props.context}
    />
  );
}

 /**
  * Renders a default menu item given the type of item it is
  * 
  * @param item A description of how to render this particular item
  * @param context Any appropriate context for this menu
  * @param keyIndex The index used for the key
  */
function renderDefaultMenuItem(item: ContextMenuGenericItem, context: any, keyIndex: number) {
  const key = `context-menu-item-${keyIndex}`;
  
  switch(item.type) {
    case "divider":
      return <></>; // TODO - need to figure out what to do here
    case "header":
      return <></>; // TODO - need to figure out what to do here
    
    case "link":
      return <ContextButtonLink key={key} {...item as unknown as ContextMenuLink} context={context}/>;
    
    case "item":
      return <ContextButtonItem key={key} {...item as unknown as ContextMenuItem} context={context}/>;

    default:
      return <></>;
  }
}

/**
 * Renders a group of buttons without a ButtonGroup wrapper
 * @param props.context The context for the buttons
 * @param props.items A list of items to render and their instructions
 */
export function ContextButtons(props: ContextButtonProps) {
  const defaultMenuItems: JSX.Element[] = [];
  let keyIndex = 0;

  props.items.forEach((item: ContextMenuGenericItem) => {
    defaultMenuItems.push(renderDefaultMenuItem(item, props.context, keyIndex++));
  });
  return <>{defaultMenuItems}</>;
}

/**
 * Renders a context button group
 * @param props.context The context for the buttons
 * @param props.items A list of items to render and their instructions
 */
export default function ContextButtonGroup(props: ContextButtonProps) {
  return <ButtonGroup><ContextButtons {...props}/></ButtonGroup>
}
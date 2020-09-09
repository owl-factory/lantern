import { IconType } from "react-icons/lib";
import { ReactNode } from "react";

// The action taken when a context menu item is clicked
export type ContextMenuActionType = (context: any) => void;

/**
 * A generic type describing any type of item usable in the ContextMenu component
 */
export interface ContextMenuGenericItem {
  type: "divider" | "header" | "link" | "item"; // Which type of item type this is
  title?: string; // The title to render
  icon?: IconType; // The icon to render in the context menu item
  action?: ContextMenuActionType; // The action to take on click
  href?: string; // An unkeyed href for the <Link> href
  keys?: any; //
}

/**
 * A type of Context Menu Item type usable specifically with the Link type
 */
export interface ContextMenuLink {
  type: "link";
  title: string;
  icon: IconType;
  href: string;
  keys: any;
}

/**
 * A type of context menu item type usable specifically with the Item type
 */
export interface ContextMenuItem {
  type: "item";
  title: string;
  icon: IconType;
  action: ContextMenuActionType; // The action to take on click
}

// The direction to drop the menu
export type DropType = "up" | "down" | "left" | "right";

// Props for the ContextMenu component
export interface ContextDropdownProps {
  as?: any;
  alignRight?: boolean; 
  children: ReactNode;
  context: any;
  drop?: DropType;
  items: ContextMenuGenericItem[];
}

/**
 * Props for the ContextButtons or ContextButtonGroup components
 */
export interface ContextButtonProps {
  context: any;
  items: ContextMenuGenericItem[]
}

// Props for the ContextMenuItem component
export interface ContextMenuItemProps {
  action: ContextMenuActionType; // The action to run when clicked. May be a link or another action. Passed the context
  context: any; // Any specific context for this contextmenu, such as an object's information from a table
  icon: IconType; // The icon to display on the right side of the context menu
  title: string; // The title of the item
}

export interface ContextMenuLinkProps {
  context: any; // Any specific context for this contextmenu, such as an object's information from a table
  href: string; 
  icon: IconType; // The icon to display on the right side of the context menu
  keys: any;
  title: string; // The title of the item
}
import { IconType } from "react-icons/lib";

// The action taken when a context menu item is clicked
export type ContextMenuActionType = (context: any) => void;

export interface ContextMenuGenericItemType {
  type: "divider" | "header" | "link" | "item"; // Which type of item type this is
  title?: string; // The title to render
  icon?: IconType; // The icon to render in the context menu item
  action?: ContextMenuActionType; // The action to take on click
  href?: string; // An unkeyed href for the <Link> href
  keys?: any; //
}

export interface ContextMenuLinkItemType {
  type: "link";
  title: string;
  icon: IconType;
  href: string;
  keys: any;
}

export interface ContextMenuItemType {
  type: "item";
  title: string;
  icon: IconType;
  action: ContextMenuActionType; // The action to take on click
}
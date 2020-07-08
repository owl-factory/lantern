// The action taken when a context menu item is clicked
export type ContextMenuActionType = (context: any) => void;

export interface ContextMenuItemType {
  divider?: boolean; // True if a divider should be rendered
  header?: boolean; // True if a header should be rendered
  title?: string; // The title to render
  icon?: JSX.Element; // The icon to render in the context menu item
  action?: ContextMenuActionType; // The action to take on click
}
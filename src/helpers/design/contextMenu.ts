import { ContextMenuItemType, ContextMenuActionType } from "../../models/design/contextMenu";

/**
 * Builds out the configuration for a context menu
 * NOTE - while not apparently terribly useful now, this will be more important when we have 
 *  two versions of the context menu, one per desktop and mobile
 */
export class ContextMenuBuilder {
  private items: ContextMenuItemType[] = [];

  /**
   * Adds a divider to the context menu
   */
  public addDivider() {
    this.items.push({divider: true})
    return this;
  }

  /**
   * Adds a header to the context menu
   * @param title The title of the header
   */
  public addHeader(title: string) {
    this.items.push({header: true, title})
    return this;
  }

  /**
   * Adds an item to the context menu
   * @param title The title of the context menu item
   * @param icon The icon to render on the right of the context menu item
   * @param action The action to run when clicking the context menu item
   */
  public addItem(title: string, icon: JSX.Element, action: ContextMenuActionType) {
    this.items.push({title, icon, action});
    return this;
  }

  /**
   * Renders out a configuration for easy use by the context menu component
   */
  public renderConfig() {
    return {items: this.items};
  }
}
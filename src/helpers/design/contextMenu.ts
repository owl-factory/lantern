import { ContextMenuGenericItemType, ContextMenuActionType } from "../../models/design/contextMenu";
import { IconType } from "react-icons/lib";
import { def } from "../tools";

/**
 * Builds out the configuration for a context menu
 * NOTE - while not apparently terribly useful now, this will be more important when we have 
 *  two versions of the context menu, one per desktop and mobile
 */
export class ContextMenuBuilder {
  
  private items: ContextMenuGenericItemType[] = [];

  /**
   * Adds a divider to the context menu
   */
  public addDivider() {
    this.items.push({type: "divider"})
    return this;
  }

  /**
   * Adds a header to the context menu
   * @param title The title of the header
   */
  public addHeader(title: string) {
    this.items.push({type: "header", title})
    return this;
  }

  /**
   * Creates an item with a built-in link for Next
   * @param title {string} The title of the link
   * @param icon {IconType} The icon to display
   * @param href {string} The href to use in the Link object
   * @param keys {object} An object with keys in the href and values for the variable in context
   */
  public addLink(title: string, icon: IconType, href: string, keys?: any) {
    keys = def<any>(keys, {});
    this.items.push({type: "link", title, icon, href, keys});
    return this;
  }

  /**
   * Adds an item to the context menu
   * @param title The title of the context menu item
   * @param icon The icon to render on the right of the context menu item
   * @param action The action to run when clicking the context menu item
   */
  public addItem(title: string, icon: IconType, action: ContextMenuActionType) {
    this.items.push({type: "item", title, icon, action});
    return this;
  }

  /**
   * Renders out a configuration for easy use by the context menu component
   */
  public renderConfig() {
    return {items: this.items};
  }
}
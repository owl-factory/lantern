import {
  ButtonConfig,
  ContextMenuActionType,
  ContextMenuBuilderOutput,
  ContextMenuGenericItem,
} from "../../model/design/contextMenu";
import { IconType } from "react-icons/lib";

/**
 * Builds out the configuration for a context menu
 * NOTE - while not apparently terribly useful now, this will be more important when we have
 *  two versions of the context menu, one per desktop and mobile
 */
export class ContextMenuBuilder {
  private buttonConfig: ButtonConfig = {
    className: "d-none d-lg-inline",
    width: 2,
  }
  private items: ContextMenuGenericItem[] = [];

  /**
   * Adds a divider to the context menu
   */
  public addDivider(): ContextMenuBuilder {
    this.items.push({type: "divider"});
    return this;
  }

  /**
   * Adds a header to the context menu
   * @param title The title of the header
   */
  public addHeader(title: string): ContextMenuBuilder {
    this.items.push({type: "header", title});
    return this;
  }

  /**
   * Creates an item with a built-in link for Next
   * @param title {string} The title of the link
   * @param icon {IconType} The icon to display
   * @param href {string} The href to use in the Link object
   * @param keys {object} An object with keys in the href and values for the variable in context
   */
  public addLink(title: string, icon: IconType, href: string, keys?: Record<string, string>): ContextMenuBuilder {
    keys = keys || {};
    this.items.push({type: "link", title, icon, href, keys});
    return this;
  }

  /**
   * Adds an item to the context menu
   * @param title The title of the context menu item
   * @param icon The icon to render on the right of the context menu item
   * @param action The action to run when clicking the context menu item
   */
  public addItem(title: string, icon: IconType, action: ContextMenuActionType): ContextMenuBuilder {
    this.items.push({type: "item", title, icon, action});
    return this;
  }

  /**
   * Renders out a configuration for easy use by the context menu component
   */
  public renderConfig(): ContextMenuBuilderOutput {
    return {
      buttonConfig: this.buttonConfig,
      items: this.items,
    };
  }
}

/**
 * Parses the raw href into a usable url
 * @param href The raw href potentially containing dynamic variables in the form `[id]`
 * @param keys An object describing how the keys from the href relate to the context
 * @param context The context of this menu from which to pull dynamic data
 */
export function parseHref(href: string, keys: Record<string, string>, context: Record<string, string>): string {
  let linkAs = href;
  const hrefKeys = href.match(/\[(.+?)\]/g);

  // Exit if no keys are found
  if (hrefKeys === null) {
    return linkAs;
  }

  // Goes through each key from the href and pulls the correct value
  hrefKeys.forEach((hrefKey: string) => {
    const cleanKey = hrefKey.slice(1, -1 );

    let value = "";
    if (cleanKey in keys) {
      value = context[keys[cleanKey]];
    } else {
      value = "undefined";
      if (context && cleanKey in context) {value = context[cleanKey];}
    }

    linkAs = linkAs.replace(hrefKey, value);
  });

  return linkAs;
}

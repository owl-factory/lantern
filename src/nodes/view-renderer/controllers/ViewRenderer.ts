import { action, makeObservable, observable, runInAction } from "mobx";
import { ViewType } from "../enums/viewType";
import { Render, RenderSources } from "../types/render";
import { View } from "../types/view";
import { parseDefaultState, parseLayout, parsePrefabs, parseSCSS, parsePageGroups, parseXML } from "../utilities/parse";
import { injectStyles, removeStyles } from "../utilities/styles";
import { validateSCSS, validateXML } from "../utilities/validation";
import type { AlertMessage } from "@owl-factory/alerts";
import { handleError } from "./helpers/errors";
import { StateType } from "../enums/stateType";
import { PageMetadata } from "../types/pages";
import { Scalar } from "types";
import { v4 as uuid } from "uuid";
import { concatSources } from "../utilities/render/sources";
import { ElementDescriptor } from "../types/elements";
import { RenderState } from "../types/state";

type Renders = Record<string, Render>;
type Views = Record<string, View>;

// Describes the values used for importing the core components required to render a View
interface ImportValues {
  xml?: string;
  scss?: string;
  css?: string;
}

interface ImportOptions {
  onError?: (error: AlertMessage) => void;
}

class ViewRendererClass {
  public views: Views = {}; // Describes the views currently loaded into the renderer
  public renders: Renders = {}; // Describes currently active and used renders

  // Has a long, slower string for checking if a render already exists
  private existingRender: Record<string, string> = {};

  constructor() {
    makeObservable(this, {
      views: observable,
      renders: observable, // Observable for their internal state

      import: action,
      startRender: action,
      endRender: action,
      setState: action,
    });
  }

  /**
   * Imports data into a view.
   * @param viewID The ID of the View to import. IDs can be the same ID as their parent document, but don't have to be.
   * Generally the parent document ID should be included in some way
   * @param viewType The type of View this is used to render. Used for determining what went wrong and limiting
   * certain fields, like inputs.
   * @param imports.xml The XML to import into the ViewRenderer
   * @param imports.css The pre-parsed CSS to import into the ViewRenderer
   * @param imports.scss The unparsed SCSS to import and parse
   * @param options.onError A callback function to run on the event that an error occurs
   * @returns True if the import was successful, false otherwise
   */
  public async import(
    viewID: string,
    viewType: ViewType,
    imports: ImportValues,
    options?: ImportOptions,
  ): Promise<boolean> {
    let xmlWarnings, scssWarnings;
    try {
      if (imports.xml) xmlWarnings = validateXML(viewType, imports.xml);
      if (imports.scss) scssWarnings = await validateSCSS(viewID, viewType, imports.scss);
      // CSS is not validated; it should always come from the backend without any client interaction
    } catch (e: unknown) {
      const defaultError = {
        title: "Unknown Validation Error",
        description: "An unknown error occured while validating the import values",
      };
      handleError(e, defaultError, options?.onError);
      return false;
    }

    let layout: ElementDescriptor<unknown>[] | undefined;
    let prefabs: Record<string, ElementDescriptor<unknown>[]> | undefined;
    let pageGroups: Record<string, any> | undefined;
    let defaultState: RenderState;
    let css: string | undefined;
    try {
      if (imports.xml) {
        const xmlDOM = parseXML(imports.xml);
        layout = parseLayout(xmlDOM);
        prefabs = parsePrefabs(xmlDOM);
        pageGroups = parsePageGroups(xmlDOM);
        defaultState = parseDefaultState(xmlDOM);
      }

      // Raw CSS takes priority
      if (imports.css) {
        css = imports.css;
      } else if (imports.scss && !imports.css) {
        css = await parseSCSS(viewID, viewType, imports.scss);
      }
    } catch (e) {
      const defaultError = {
        title: "Unknown Parsing Error",
        description: "An unknown error occured while parsing the import values",
      };
      handleError(e, defaultError, options?.onError);
      return false;
    }

    // Load everything in if it's present & parsed
    if (!this.views[viewID]) {
      this.views[viewID] = {
        renderCount: 0,
        defaultState: { [StateType.Collapse]: {}, [StateType.CurrentPage]: {} }
      };
    }

    runInAction(() => {
      if (layout) this.views[viewID].layout = layout;
      if (prefabs) this.views[viewID].prefabs = prefabs;
      if (pageGroups) this.views[viewID].pages = pageGroups;
      if (defaultState) this.views[viewID].defaultState = defaultState;
      if (css) this.views[viewID].css = css;
    });

    return true;
  }

  /**
   * Begins a render for a specific view.
   * @todo Differentiate between modification renders and gameplay renders?
   * @param viewID The ID of the view to use for this render
   * @param sources The external data that may be used in the rendering of this view
   * @returns The unique ID for this render
   */
  public startRender(viewID: string, sources: RenderSources): string {
    const view = this.views[viewID];
    if (view === undefined) { return ""; } // TODO - include special handle case for failures?

    view.renderCount++;
    if (view.css) {
      injectStyles(view.css, viewID, true); // Always overwrite in the event of a change
    }

    // Remove the clean up function if one is running
    if (view.cleanupID) {
      clearTimeout(view.cleanupID);
      view.cleanupID = undefined;
    }

    // The sources are put into a standardized string to be used as a key for accessing previous renders, allowing
    // renders to preserve their state across instances
    const sourceString = concatSources(sources);
    const existingRenderID = this.existingRender[sourceString];
    if (existingRenderID) {
      return existingRenderID;
    }

    const renderID = uuid();
    this.existingRender[sourceString] = renderID;
    this.renders[renderID] = {
      viewID,
      sources,
      state: {
        [StateType.CurrentPage]: { ...view.defaultState.pages },
        [StateType.Collapse]: { ...view.defaultState.collapses },
       },
    };

    return renderID;
  }

  /**
   * Ends a specific render for cleanup purposes.
   * @param renderID The ID of the render to end
   */
  public endRender(renderID: string): void {
    const render = this.renders[renderID];
    if (render === undefined) { return; }

    const view = this.views[render.viewID];

    view.renderCount--;
    if (view.renderCount <= 0) {
      view.renderCount = 0;
      view.cleanupID = setTimeout(() => {
        removeStyles(render.viewID);
      }, 5 * 60 * 1000);
    }

    delete this.renders[renderID];
    return;
  }

  /**
   * Gets a single value from a piece of state
   * @param renderID The ID of the render the state describes
   * @param type The type of state to access
   * @param field The field name of the state to fetch
   * @returns The value of the current state
   */
  public getState<T extends (number | boolean)>(renderID: string, type: StateType, field: string): T {
    const render = this.renders[renderID];
    const value = render.state[type][field] || undefined;
    switch (type) {
      case StateType.CurrentPage:
        if (render === undefined || value === undefined) { return 0 as T; }
        return value as T;
      case StateType.Collapse:
        if (render === undefined || value === undefined) { return false as T; }
        return value as T;
    }
  }

  /**
   * Updates the state for the given render and field
   * @param renderID The ID of the render the state describes
   * @param type The type of state to access
   * @param field The field name of the state to set
   * @param value The new value to set within the state
   */
  public setState(renderID: string, type: StateType, field: string, value: Scalar | undefined): void {
    const render = this.renders[renderID];
    if (!render) { return; }
    if (value === undefined) {
      delete render.state[type][field];
      return;
    }

    switch (type) {
      case StateType.Collapse:
        if (typeof value !== "boolean") { render.state[type][field] = !!value; }
        else { render.state[type][field] = value; }
        break;

      case StateType.CurrentPage:
        // Set if number or if string can be parsed into a number
        if (typeof value === "number") {
          render.state[type][field] = value;
          break;
        } else if (typeof value === "string") {
          const numValue = parseInt(value);
          if (!isNaN(numValue)) {
            render.state[type][field] = numValue;
            break;
          }
        }
    }
  }

  /**
   * Fetches the page metadata used for a given render and group
   * @param renderID The ID of the render attempting to use these pages
   * @param group The group name of the pages the render is attempting to access
   * @returns An array of the page details describing the metadata of each page
   */
  public getPages(renderID: string, group: string): PageMetadata[] {
    // Base case: return nothing if the render ID or group are invalid
    if (!renderID || !group) return [];

    const render = ViewRenderer.renders[renderID];
    if (!render) return [];

    const view = ViewRenderer.views[render.viewID];
    if (!view || !view.pages) return [];

    const pages = view.pages[group] || [];
    return pages;
  }
}

export const ViewRenderer = new ViewRendererClass();

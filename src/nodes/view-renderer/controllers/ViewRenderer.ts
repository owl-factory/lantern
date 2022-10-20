import { action, makeObservable, observable } from "mobx";
import { ViewType } from "../enums/viewType";
import { Render, RenderSources } from "../types/render";
import { View } from "../types/view";

type Renders = Record<string, Render>;
type Views = Record<string, View>;

// Describes the values used for importing the core components required to render a View
interface ImportValues {
  xml?: string;
  scss?: string;
  css?: string;
}


class ViewRendererClass {
  public views: Views = {}; // Describes the views currently loaded into the renderer
  public renders: Renders = {}; // Describes currently active and used renders

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
   * @param imports The values being imported into the View
   * @returns True if the import was successful, false otherwise
   */
  public import(viewID: string, viewType: ViewType, imports: ImportValues): boolean {
    return true;
  }

  /**
   * Begins a render for a specific view.
   * @param viewID The ID of the view to use for this render
   * @param sources The external data that may be used in the rendering of this view
   * @returns The unique ID for this render
   */
  public startRender(viewID: string, sources: RenderSources): string {
    return "";
  }

  /**
   * Ends a specific render for cleanup purposes.
   * @param renderID The ID of the render to end
   */
  public endRender(renderID: string): void {
    return;
  }

  /**
   * Gets a single value from a piece of state
   * @param renderID The ID of the render the state describes
   * @param field The field name of the state to fetch
   * @returns The value of the current state
   */
  public getState(renderID: string, field: string): unknown {
    return undefined;
  }

  /**
   * Updates the state for the given render and field
   * @param renderID The ID of the render the state describes
   * @param field The field name of the state to set
   * @param value The new value to set within the state
   */
  public setState(renderID: string, field: string, value: unknown): void {
    return;
  }
}

export const ViewRenderer = new ViewRendererClass();

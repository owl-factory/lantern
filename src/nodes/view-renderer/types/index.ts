import { Scalar } from "types";
import { ElementDescriptor } from "./elements";

export interface SheetElementProps<T extends ElementDescriptor> {
  $key: string; // The key used to identify the element in a loop
  renderID: string; // The ID used for this current render
  element: T; // The element descriptor
  properties: SheetProperties;
}

export interface SheetTabElementDescriptor {
  name: string;
  access: string;
}

// Describes variables that are created during the render of the sheet
export type SheetProperties = Record<string, (Scalar | Record<string, string | unknown>)> & StaticSheetProperties;

// Sheet properties that should be accessible and not overwritten by user-defined variables
interface StaticSheetProperties {
  $prefix: string;
  // The source that a variable key draws from. For example, 'item' might be sourced from 'content.items'
  $source: Record<string, string>;
  // The index value for a specific variable key. Used even if an index is not specified
  $index: Record<string, number>;
}

// A persistent state that can traverse down the initial sheet parsing
export interface ViewState {
  // The ID of the View that this belongs to
  id: string;
  // The key the use for uniquely describing an element
  key: string;
  // The prefabs defined in this View. Required for ensuring that a prefab exists on compile time
  prefabs: Record<string, unknown>;
}

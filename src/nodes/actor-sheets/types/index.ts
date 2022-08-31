import { GenericSheetElementDescriptor } from "nodes/actor-sheets/types/elements/generic";
import { Scalar } from "types";

export interface RenderGroup {
  actorID: string;
  rulesetID: string;
  sheetID: string;
}

export interface SheetElementProps<T extends GenericSheetElementDescriptor> {
  $key: string; // The key used to identify the element in a loop
  renderID: string; // The ID used for this current render
  element: T;
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
export interface SheetState {
  key: string;
  prefabs: Record<string, HTMLCollection>;
}

import { GenericSheetElementDescriptor } from "nodes/actor-sheets/types/elements/generic";
import { Scalar } from "types";

export interface SheetElementProps<T extends GenericSheetElementDescriptor> {
  id: string;
  element: T;
  properties: SheetProperties;
}

export interface SheetTabElementDescriptor {
  name: string;
  access: string;
}

// Describes variables that are created during the render of the sheet
export type SheetProperties = Record<string, (Scalar | Record<string, string | unknown>)>;

// A persistent state that can traverse down the initial sheet parsing
export interface SheetState {
  prefabs: Record<string, HTMLCollection>;
}

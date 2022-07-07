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
export type SheetProperties = Record<string, (Scalar | Record<string, string | unknown>)> & StaticSheetProperties;

// Sheet properties that should be accessible and not overwritten by user-defined variables
interface StaticSheetProperties {
  $prefix: string;
}

// A persistent state that can traverse down the initial sheet parsing
export interface SheetState {
  key: string;
  prefabs: Record<string, HTMLCollection>;
}

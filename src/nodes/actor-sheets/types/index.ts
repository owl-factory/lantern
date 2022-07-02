import { GenericSheetElementDescriptor } from "nodes/actor-sheets/types/elements/generic";

export interface SheetElementProps<T extends GenericSheetElementDescriptor> {
  id: string;
  element: T;
  // properties: Record<string, unknown>;
}

export interface SheetTabElementDescriptor {
  name: string;
  access: string;
}

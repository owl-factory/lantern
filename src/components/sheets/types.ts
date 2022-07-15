import { GenericSheetElementDescriptor } from "types/sheetElementDescriptors/generic";

export interface SheetElementProps<T extends GenericSheetElementDescriptor> {
  id: string;
  element: T;
  // properties: Record<string, unknown>;
}

import { GenericSheetElementDescriptor } from "nodes/actor-sheets/types/elements/generic";
import { PageElementDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetTabElementDescriptor } from "nodes/actor-sheets/types";

/**
 * Describes a sheet pageable element
 */
export interface PageableElementDescriptor extends GenericSheetElementDescriptor {
  tabs: SheetTabElementDescriptor[];
  pages: PageElementDescriptor[];
  children: GenericSheetElementDescriptor[];
}

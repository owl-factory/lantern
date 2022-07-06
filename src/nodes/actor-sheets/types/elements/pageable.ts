import { GenericSheetElementDescriptor } from "nodes/actor-sheets/types/elements/generic";
import { PageDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetTabElementDescriptor } from "nodes/actor-sheets/types";

/**
 * Describes a sheet pageable element
 */
export interface PageableDescriptor extends GenericSheetElementDescriptor {
  tabs: SheetTabElementDescriptor[];
  pages: PageDescriptor[];
  children: GenericSheetElementDescriptor[];
}

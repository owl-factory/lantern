import { ElementDescriptor } from "../generic";
import { PageDescriptor } from "nodes/view-renderer/types/elements";
import { SheetTabElementDescriptor } from "nodes/actor-sheets/types";

/**
 * Describes a sheet pageable element
 */
export interface PageableDescriptor extends ElementDescriptor {
  id: string;
  tabs: SheetTabElementDescriptor[];
  pages: PageDescriptor[];
  children: ElementDescriptor[];
}

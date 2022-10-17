import { GenericElementDescriptor } from "../generic";
import { PageDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetTabElementDescriptor } from "nodes/actor-sheets/types";

/**
 * Describes a sheet pageable element
 */
export interface PageableDescriptor extends GenericElementDescriptor {
  id: string;
  tabs: SheetTabElementDescriptor[];
  pages: PageDescriptor[];
  children: GenericElementDescriptor[];
}

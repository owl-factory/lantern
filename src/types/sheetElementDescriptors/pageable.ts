import { GenericSheetElementDescriptor } from "types/sheetElementDescriptors/generic";
import { PageElementDescriptor } from "types/sheetElementDescriptors";
import { SheetTabElementDescriptor } from "../../controllers/actor/ActorSheetController";

/**
 * Describes a sheet pageable element
 */
export interface PageableElementDescriptor extends GenericSheetElementDescriptor {
  tabs: SheetTabElementDescriptor[];
  pages: PageElementDescriptor[];
  children: GenericSheetElementDescriptor[];
}

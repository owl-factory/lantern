import { GenericSheetElement } from "types/layouts/genericElement";
import { PageElement } from "types/layouts/pageElement";
import { SheetTab } from "../../controllers/layout/SheetController";

export interface PageableElement extends GenericSheetElement {
  tabs: SheetTab[];
  pages: PageElement[];
  children: GenericSheetElement[];
}

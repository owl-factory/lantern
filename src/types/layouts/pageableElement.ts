import { GenericSheetElement } from "types/layouts/genericElement";
import { PageElement } from "types/layouts/pageElement";
import { SheetTabElement } from "../../controllers/layout/SheetController";

export interface PageableElement extends GenericSheetElement {
  tabs: SheetTabElement[];
  pages: PageElement[];
  children: GenericSheetElement[];
}

import { GenericSheetElement } from "types/layouts/genericElement";
import { PageElement } from "types/layouts/pageElement";
import { SheetTabElement } from "../../controllers/layout/SheetController";

export interface NewPrefabElement extends GenericSheetElement {
  name: string;
  children: GenericSheetElement[];
}

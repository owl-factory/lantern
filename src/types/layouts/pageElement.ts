import { GenericSheetElement } from "./genericElement";

export interface PageElement extends GenericSheetElement {
  children: GenericSheetElement[];
}

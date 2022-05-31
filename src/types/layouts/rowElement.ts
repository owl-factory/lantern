import { GenericSheetElement } from "./genericElement";

export interface RowElement extends GenericSheetElement {
  children: GenericSheetElement[];
}

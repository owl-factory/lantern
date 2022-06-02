import { GenericSheetElement } from "./genericElement";

export interface LayoutElement extends GenericSheetElement {
  children: GenericSheetElement[];
}

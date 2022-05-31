import { GenericSheetElement } from "./genericElement";

export interface SelectElement extends GenericSheetElement {
  children: GenericSheetElement[];
}

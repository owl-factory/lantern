import { GenericSheetElement } from "./genericElement";

export interface BorderElement extends GenericSheetElement {
  children: GenericSheetElement[];
  borderStyle: string;
}

import { GenericSheetElement } from "./genericElement";

export interface BackgroundElement extends GenericSheetElement {
  children: GenericSheetElement[];
  src: string;
}

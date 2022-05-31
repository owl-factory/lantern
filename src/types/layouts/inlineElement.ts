import { GenericSheetElement } from "./genericElement";

export interface InlineElement extends GenericSheetElement {
  children: GenericSheetElement[];
}

import { GenericSheetElement } from "./genericElement";

export interface LabelElement extends GenericSheetElement {
  for: string;
  text: string;
}

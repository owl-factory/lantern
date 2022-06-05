import { GenericSheetElement } from "./genericElement";

export interface RadioButtonElement extends GenericSheetElement {
  id?: string;
  name: string;
  value: string;
  label: string;
}

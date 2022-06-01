import { GenericSheetElement } from "./genericElement";

export interface CheckboxElement extends GenericSheetElement {
  id?: string;
  name: string;
  value: string;
}

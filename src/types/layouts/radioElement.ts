import { GenericSheetElement } from "./genericElement";

export interface RadioElement extends GenericSheetElement {
  id?: string;
  name: string;
  value: string;
}

import { GenericSheetElement } from "./genericElement";

export interface ColumnElement extends GenericSheetElement {
  children: GenericSheetElement[];
  weight: number;
}

import { GenericSheetElement } from "./genericElement";

export interface PrefabElement extends GenericSheetElement {
  name: string;
  arguments: Record<string, unknown>;
  children: GenericSheetElement[];
}

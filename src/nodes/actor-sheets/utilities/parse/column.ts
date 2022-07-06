import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { ColumnDescriptor } from "nodes/actor-sheets/types/elements";
import { parseUnknownElement } from "./unknown";

/**
 * Converts a column element into a column element descriptor
 * @param columnElement The column element to convert
 * @returns A column element descriptor
 */
export function parseColumnElement(key: string, columnElement: Element, state: SheetState) {
  const elementDetails: ColumnDescriptor = {
    element: SheetElementType.Column,
    weight: parseInt(columnElement.getAttribute("weight") || "1"),
    children: [],
  };

  for (const childElement of columnElement.children) {
    elementDetails.children.push(parseUnknownElement(key, childElement, state) as any);
  }

  return elementDetails;
}

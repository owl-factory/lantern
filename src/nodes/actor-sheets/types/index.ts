import { GenericSheetElementDescriptor } from "nodes/actor-sheets/types/elements/generic";
import { Scalar } from "types";
import { ExpressionType } from "../enums/expressionType";

export interface SheetElementProps<T extends GenericSheetElementDescriptor> {
  id: string;
  element: T;
  properties: SheetProperties;
}

export interface SheetTabElementDescriptor {
  name: string;
  access: string;
}

// Describes variables that are created during the render of the sheet
export type SheetProperties = Record<string, (Scalar | Record<string, string | unknown>)>;

// Describes the contents of an expression
export interface Expression {
  items: ExpressionItem[];
}

// Describes an item within an expression
export interface ExpressionItem {
  type: ExpressionType;
  value?: string;
}

// Describes the object created from parsing out a string into chunks of plain strings and expression objects
export type ParsedExpressionString = (string | Expression)[];

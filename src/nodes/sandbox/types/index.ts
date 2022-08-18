import { Scalar } from "types";

// TODO - remove in cleanup
export interface RenderGroup {
  actorID: string;
  rulesetID: string;
  sheetID: string;
}

// TODO - remove in cleanup
// Describes variables that are created during the render of the sheet
export type SheetProperties = Record<string, (Scalar | Record<string, string | unknown>)> & StaticSheetProperties;

// Sheet properties that should be accessible and not overwritten by user-defined variables
interface StaticSheetProperties {
  $prefix: string;
  // The source that a variable key draws from. For example, 'item' might be sourced from 'content.items'
  $source: Record<string, string>;
  // The index value for a specific variable key. Used even if an index is not specified
  $index: Record<string, number>;
}

// TODO - remove in cleanup
// Describes the object created from parsing out a string into chunks of plain strings and expression objects
export interface ParsedExpressionString {
  isExpression: boolean;
  value: string;
}


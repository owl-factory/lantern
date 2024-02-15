import { GetOptions } from "features/dynamicRender/types/query";

/** Describes a text value provided by the render sheet */
export type ExpressionDescriptor = PlainText | ComputedExpression;

/** Text that is hardcoded and will not be evaluated */
type PlainText = {
  type: ExpressionType.Hardcoded;
  value: string;
};

/** A string containing an expression that must be computed */
type ComputedExpression = {
  type: ExpressionType.Computed;
  queries: Record<string, GetOptions>;
};

/** The different types of expressions provided text can be */
export enum ExpressionType {
  /** Static text that does not need to be computed */
  Hardcoded,
  /** Text containing an expression that must be computed */
  Computed,
}

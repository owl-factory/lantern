import { GetOptions } from "features/dynamicRender/types/query";

/** Describes a text value provided by the render sheet */
export type ExpressionDescriptor = PlainTextExpression | ComputedExpression;

/** Text that is hardcoded and will not be evaluated */
export type PlainTextExpression = {
  type: ExpressionType.PlainText;
  value: string;
};

/** A string containing an expression that must be computed */
export type ComputedExpression = {
  type: ExpressionType.Computed;
  queries: Record<string, GetOptions>;
};

/** The different types of expressions provided text can be */
export enum ExpressionType {
  /** Static text that does not need to be computed */
  PlainText,
  /** Text containing an expression that must be computed */
  Computed,
  /**
   * An expression that itself contains another expression that must
   * be computed prior to this evaluation
   */
  NestedComputed,
}

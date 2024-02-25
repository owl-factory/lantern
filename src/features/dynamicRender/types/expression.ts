export type ExpressionDescriptor = InvalidExpression | PlainTextExpression;

/** Describes an Invalid Expression, the given value and the reason why it fails */
export type InvalidExpression = {
  type: ExpressionType.Invalid;
  value: string | undefined;
  why: string;
};

/** Describes an expression that's simply plain text that requires no evaluation */
export type PlainTextExpression = {
  type: ExpressionType.PlainText;
  value: string;
};

/** The types of expressions, describing the sort of processing they will need */
export enum ExpressionType {
  /** This expression is invalid for some reason or another */
  Invalid,
  /** This expression is plain text and does not require evaluation */
  PlainText,
}

/** A parsed attribute value */
export type Attribute = StaticAttribute | ExpressionAttribute;

/** An attribute that has no expressions and is static */
type StaticAttribute = {
  value: string;
  isExpression: false;
};

/** An attribute that has expression(s) and whose value can change */
type ExpressionAttribute = {
  value: string;
  isExpression: true;
  expressions: string[];
  keys: unknown;
};

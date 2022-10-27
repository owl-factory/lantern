import { ExpressionVariableType } from "../enums/expressionVariableType";

// Describes an expression as given by the user, parsed into a state that is easily useable by the renderer
export interface Expression {
  isExpression: boolean; // True if there is an expression within the string requiring evaluation (any instances of ${})
  value: string; // The raw value provided by the user
  // A description of any variable access made by the expression for fast computation and rerendering
  variables?: ExpressionVariable[];
}

export interface ExpressionVariable {
  type: ExpressionVariableType; // Which type of data this refers to. This may be custom
  fullVariable: string; // The full name (eg content.items[i].name)
  field?: string; // Which field is being accessed
  index?: number; // The index of the value (for content or arrays)
  contentField?: string; // An additional field of the content
}

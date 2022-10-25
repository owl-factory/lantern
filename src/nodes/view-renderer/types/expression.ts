// Describes an expression as given by the user, parsed into a state that is easily useable by the renderer
export interface Expression {
  isExpression: boolean; // True if there is an expression within the string requiring evaluation (any instances of ${})
  value: string; // The raw value provided by the user
  // A description of any variable access made by the expression for fast computation and rerendering
  variables?: string[];
}

/** Defines an attribute of a Dynamic Render markup element */
export type AttributeDefinition = {
  /** The name of the attribute */
  name: string;
  /** The default value if not present */
  default?: string;
  /** If the attribute is required */
  required?: boolean;
  /** Indicates that this attribute supports expressions */
  supportsExpressions?: boolean;
};

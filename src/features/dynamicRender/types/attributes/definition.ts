/** Defines an attribute of a Dynamic Element */
export type AttributeDefinition = {
  /** The name of the attribute */
  name: string;
  /** The default value if not present */
  default?: string;
  /** If the attribute is required */
  required?: boolean;
};

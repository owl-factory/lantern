/**
 * A root controller interface shared between all DynamicRender controllers
 */
export interface Controller {
  isValid: () => boolean;
  getErrors: () => string[];
}

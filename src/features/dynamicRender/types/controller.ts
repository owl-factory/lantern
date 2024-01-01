/**
 * A root controller interface shared between all DynamicRender controllers
 */
export interface Controller {
  load: () => Promise<void>;
  isValid: () => boolean;
  getErrors: () => string[];
  ready: boolean;
}

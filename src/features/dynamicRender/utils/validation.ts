import { Controller } from "../types/controller";

export abstract class ValidationController implements Controller {
  errors: string[];

  /**
   * Checks if the current controller has any issues, storing them
   * to the errors array if so
   */
  abstract validate();

  /**
   * Checks if the current controller is valid
   */
  isValid() {
    this.errors = [];
    this.validate();
    return this.errors.length > 0;
  }

  /**
   * Returns a list of errors present within this controller
   */
  getErrors() {
    return [...this.errors];
  }
}

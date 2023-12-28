import { MarkupController, MarkupControllerState } from "features/dynamicRender/types/markup";
import { ValidationController } from "../../validation";

/**
 * An empty Markup Controller as a placeholder in the event that no proper
 * controller is defined.
 */
export class NullMarkupController extends ValidationController implements MarkupController {
  state = MarkupControllerState.NoOp;
  layout = undefined;

  async load() {}

  validate() {
    this.errors.push("No Markup Controller was provided");
  }
}

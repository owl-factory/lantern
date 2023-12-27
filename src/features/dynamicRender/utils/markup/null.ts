import { MarkupController } from "features/dynamicRender/types/markup";
import { ValidationController } from "../validation";

/**
 * An empty Markup Controller as a placeholder in the event that no proper
 * controller is defined.
 */
export class NullMarkupController extends ValidationController implements MarkupController {
  validate() {
    this.errors.push("No Markup Controller was provided");
  }
}

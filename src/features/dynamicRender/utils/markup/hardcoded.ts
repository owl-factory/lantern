import { MarkupController } from "features/dynamicRender/types/markup";
import { ValidationController } from "../validation";

/**
 * A Markup Controller for accessing a markup file stored locally within this code
 */
export class HardcodedMarkupController extends ValidationController implements MarkupController {
  constructor() {
    super();
  }

  validate() {
    return;
  }
}

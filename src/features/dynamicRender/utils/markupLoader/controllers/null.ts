import { MarkupLoaderController, MarkupLoaderControllerState } from "features/dynamicRender/types/markupLoader";
import { ValidationController } from "features/dynamicRender/utils/validation";
import { Err } from "utils/functional";

/**
 * An empty Markup Loader Controller as a placeholder in the event that
 * no proper controller is defined.
 */
export class NullMarkupLoaderController extends ValidationController implements MarkupLoaderController {
  state = MarkupLoaderControllerState.NoOp;

  async load() {
    return Err("No Markup Loader Controller was provided");
  }
  validate() {
    this.errors.push("No Markup Loader Controller was provided");
  }
}

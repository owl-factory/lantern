import { LoaderController, LoaderControllerState } from "features/dynamicRender/types/controllers/loader";
import { ValidationController } from "features/dynamicRender/utils/validation";

/**
 * An empty Markup Loader Controller as a placeholder in the event that
 * no proper controller is defined.
 */
export class NullLoaderController extends ValidationController implements LoaderController {
  _state = LoaderControllerState.NoOp;
  markup: string;

  async load() {}
  validate() {
    this.errors.push("No Markup Loader Controller was provided");
  }
}

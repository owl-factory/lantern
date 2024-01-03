import { LoaderControllerState } from "features/dynamicRender/types/controllers/loader";
import { LoaderController } from "./common";

/**
 * An empty Markup Loader Controller as a placeholder in the event that
 * no proper controller is defined.
 */
export class NullLoaderController extends LoaderController {
  _state = LoaderControllerState.NoOp;

  /**
   * Fetches the data from its source
   */
  async fetch() {
    this.setState(LoaderControllerState.FetchFailed, "No fetch function has been implemented");
  }
}

import { action, computed, safeMakeObservable } from "lib/mobx";
import { FactoryOptions } from "features/dynamicRender/types/factory";
import { LoaderControllerState, MarkupSource } from "features/dynamicRender/types/controllers/loader";
import { LoaderController } from "./common";

/**
 * A Controller for fetching markup that is stored at a static HTTP location
 */
export class HardcodedLoaderController extends LoaderController {
  _state: LoaderControllerState = LoaderControllerState.NoOp;
  apiRoute: string;

  constructor(options: FactoryOptions) {
    super();

    if (options.markupSource !== MarkupSource.Hardcoded) return this;

    this.apiRoute = options.uri;

    const obserableResult = safeMakeObservable(this, {
      ready: computed,
      setState: action,
    });

    if (obserableResult.ok === false) {
      this.setState(LoaderControllerState.MobxError, obserableResult.error);
      return this;
    }

    this.setState(LoaderControllerState.Ready);
  }

  /**
   * Fetches the markup from the hardcoded location
   */
  async fetch(): Promise<void> {
    // TODO - abort the previous fetch if this one is still operating
    this.setState(LoaderControllerState.Fetching);
    const markupResponse = await fetch(this.apiRoute);

    if (!markupResponse.ok) {
      this.setState(LoaderControllerState.FetchFailed, markupResponse.statusText);
      return;
    }

    this.markup = await markupResponse.text();
    this.setState(LoaderControllerState.Ready);
  }
}

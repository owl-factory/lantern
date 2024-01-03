import { FactoryOptions } from "features/dynamicRender/types/factory";
import { HardcodedLoaderController } from "./controllers/hardcoded";
import { MarkupSource } from "features/dynamicRender/types/controllers/loader";
import { LoaderController } from "./controllers/common";

/**
 * Builds a LoaderController for fetching Markup from a source
 */
export class LoaderFactory {
  static build(options: FactoryOptions): LoaderController {
    switch (options.markupSource) {
      case MarkupSource.Hardcoded:
        return new HardcodedLoaderController(options);
    }
  }
}

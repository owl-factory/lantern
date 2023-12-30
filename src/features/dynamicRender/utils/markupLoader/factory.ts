import { FactoryOptions } from "features/dynamicRender/types/factory";
import { MarkupSource } from "features/dynamicRender/types/markup";
import { MarkupLoaderController } from "features/dynamicRender/types/markupLoader";
import { HardcodedMarkupLoaderController } from "./controllers/hardcoded";

/**
 * Builds a LoaderController for a MarkupController
 */
export class MarkupLoaderFactory {
  static build(options: FactoryOptions): MarkupLoaderController {
    switch (options.markupSource) {
      case MarkupSource.Hardcoded:
        return new HardcodedMarkupLoaderController(options);
    }
  }
}

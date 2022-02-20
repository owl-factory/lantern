import { CacheController } from "@owl-factory/cache/AbstractCacheController";
import { DataManager } from "@owl-factory/data/AbstractDataManager";
import { rest } from "@owl-factory/https/rest";
import { isOwner } from "server/logic/security";
import { ImageDocument } from "types/documents";

// class $ImageData extends CacheController<ImageDocument> {
//   key = "image";
//   apiURL = '/api/images'
// }

// export const ImageData = new $ImageData();

class ImageDataManager extends DataManager<Partial<ImageDocument>> {
  public readonly collection = "images";

  constructor() {
    super();

    this.addGroup("owned-image", isOwner);
  }

  protected async loadDocuments(refs: string[]): Promise<Partial<ImageDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ images: Partial<ImageDocument>[] }>(`/api/images`, { refs: refs });
    return docs.data.images;
  }
}

export const ImageData = new ImageDataManager();

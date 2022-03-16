import { DataManager } from "@owl-factory/data/DataManager";
import { rest } from "@owl-factory/https/rest";
import { isOwner } from "server/logic/security";
import { ImageDocument } from "types/documents";

class ImageDataManager extends DataManager<Partial<ImageDocument>> {
  public collection = "images";

  constructor() {
    super();

    this.addGroup("owned-image", isOwner);
  }

  public async loadDocuments(refs: string[]): Promise<Partial<ImageDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ images: Partial<ImageDocument>[] }>(`/api/images`, { refs: refs });
    return docs.data.images;
  }
}

export const ImageData = new ImageDataManager();

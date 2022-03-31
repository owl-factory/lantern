import { DataManager } from "@owl-factory/data/DataManager";
import { isOwner } from "security/documents";
import { ImageDocument } from "types/documents";

class ImageDataManager extends DataManager<Partial<ImageDocument>> {
  public collection = "images";

  constructor() {
    super("/api/images");

    this.addGroup("owned-image", isOwner);
  }
}

export const ImageData = new ImageDataManager();

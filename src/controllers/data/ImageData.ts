import { DataManager } from "@owl-factory/data";
import { isOwner } from "security/documents";
import { FileDocument } from "types/documents";

class FileDataManager extends DataManager<Partial<FileDocument>> {
  public collection = "images";

  constructor() {
    super("/api/images");

    this.addGroup("owned-image", isOwner);
  }
}

export const FileData = new FileDataManager();

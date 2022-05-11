import { DataManager } from "@owl-factory/data/DataManager";
import { rest } from "@owl-factory/https/rest";
import { Auth } from "controllers/auth";
import { isOwner } from "server/logic/security";
import { FileDocument } from "types/documents";

class FileDataManager extends DataManager<Partial<FileDocument>> {
  public collection = "images";

  constructor() {
    super();

    this.addGroup("owned-image", isOwner);
  }

  public async loadDocuments(refs: string[]): Promise<Partial<FileDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ images: Partial<FileDocument>[] }>(`/api/images`, { refs: refs });
    return docs.data.images;
  }

  /**
   * Reserves space for a file, retrieves the destination URL, and 
   * @param values The values of the form to uplaod
   */
  public async upload(values: { file: File }) {
    // Validate user
    if (!Auth.isLoggedIn) { throw "You must be logged in to upload files"; }

    const doc: Partial<FileDocument> = {
      name: values.file.name.replace(/.*?[\\/]/, ""),
      type: values.file.type,
    };

    // Validate data
    if (!values.file) { throw "You must select a file to upload."; }

    // Create new File document
    // TODO - move into it's own function?
    let res;
    try {
      res = await rest.put<{ file: FileDocument, uploadURL: string }>(`/api/files/begin-upload`, doc);
    } catch (e: any) {
      // TODO - make a little more descriptive
      throw "An error occured while attempting to reserve space for the file";
    }
    return
    // Upload to AWS
    // TODO - move into its own function?
    let awsRes;
    try {
      awsRes = await s3.upload(res.data.uploadURL, values.file);
    } catch (e: any) {
      // We don't need to wait for this. If it fails, a cleanup action can take care of this
      rest.delete(`/api/files/${res.data.file.ref}`, {});
      throw "The file failed to upload successfully";
    }

    // Update File document with data

  }
}

const s3 = {
  upload: async (url: string, file: File) => {
    return await fetch(url, { method: "PUT", body: file });
  },
}

export const FileData = new FileDataManager();

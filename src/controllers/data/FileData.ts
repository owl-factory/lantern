import { s3 } from "@owl-factory/aws/s3";
import { DataManager } from "@owl-factory/data";
import { rest } from "@owl-factory/https";
import { ServerResponse } from "@owl-factory/https";
import { Collection } from "fauna";
import { isOwner } from "security/documents";
import { FileDocument, UserDocument } from "types/documents";
import { Mimetype, mimetypeToTypeMap } from "types/enums/files/mimetypes";
import { FileType } from "types/enums/files/type";
import { requireLogin } from "utilities/validation/account";
import { validateFileUploadCreationDoc, validateRawFile } from "utilities/validation/file";
import { UserData } from "./UserData";

class FileDataManager extends DataManager<Partial<FileDocument>> {
  public collection = Collection.Files;

  constructor() {
    super("/api/files");

    this.addGroup("owned-image", isOwner);
  }

  public async loadDocuments(refs: string[]): Promise<Partial<FileDocument>[]> {
    if (refs.length === 0) { return []; }
    const docs = await rest.post<{ images: Partial<FileDocument>[] }>(`/api/images`, { refs: refs });
    return docs.data.images;
  }

  /**
   * Reserves space for a file, retrieves the destination URL, and validates the file on completion
   * @todo Break up into subfunctions. This is too long
   * @param values The values of the form to uplaod
   */
  public async upload(values: { file: File, auxData: Record<string, unknown> }) {
    // Validate user
    requireLogin();
    validateRawFile(values.file);

    // Create new File document
    const doc: Partial<FileDocument> = {
      name: values.file.name.replace(/.*?[\\/]/, ""),
      mimetype: values.file.type as Mimetype,
      fileType: (mimetypeToTypeMap as Record<string, FileType>)[values.file.type],
      sizeInBytes: values.file.size, // We do not guarantee this number is correct
    };

    switch(doc.fileType) {
      case FileType.Image:
        doc.height = values.auxData.height as number || 0;
        doc.width = values.auxData.width as number || 0;
        break;
    }

    // Validate data
    validateFileUploadCreationDoc(doc);

    // TODO - move into it's own function?
    let res;
    try {
      res = await rest.put<{ file: FileDocument, uploadURL: string }>(`/api/files/begin-upload`, { doc });
    } catch (e: any) {
      // TODO - make a little more descriptive
      throw "An error occured while attempting to reserve space for the file";
    }

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

    res.data.file.src = awsRes.url.substring(0, awsRes.url.indexOf("?"));

    // Update File document with data
    rest.post<{ file: FileDocument, account?: UserDocument }>(`/api/files/validate-upload`, { file: res.data.file })
    .then((validateRes: ServerResponse<{ file: FileDocument, account?: UserDocument }>) => {
      if (!validateRes.success) { return; } // Do we want to notify on failure?

      FileData.set(validateRes.data.file);
      if (!validateRes.data.account) { return; }
      UserData.set(validateRes.data.account);
    });
  }
}

export const FileData = new FileDataManager();

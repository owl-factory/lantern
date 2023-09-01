import { s3 } from "utilities/aws/s3";
import { HTTPHandler, createEndpoint } from "nodes/https/backend";
import { Auth } from "controllers/auth";
import { NextApiRequest } from "next";
import { Mimetype } from "types/enums/files/mimetypes";
import { requireLogin, requirePermission, validateAccountHasSpace } from "utilities/validation/account";

/**
 * Validates the successful upload of a file
 * @param req The request containing a body with a file document 'doc'
 */
async function validateUpload(this: HTTPHandler, req: NextApiRequest) {
  // Checks aren't strictly required, but it is better to spend a little time verifying the user
  // has access than pinging the database on each run
  // requireLogin();
  // requirePermission("uploadFile");

  // const fileDoc = {} as any;
  // console.log(fileDoc)
  // // If we're not pending, then there is nothing to be done. Exit.
  // if (!fileDoc.isPending) {
  //   this.returnSuccess({ file: fileDoc });
  //   return;
  // }

  // const fileMetadata = await s3.getObjectMetadata(fileDoc.s3Path || "");
  // // Catch if file metadata does not exist. This should never happen unless something goes wonderfully wrong
  // if (!fileMetadata) {
  //   // FileLogic.delete(fileDoc.ref);
  //   this.returnSuccess({
  //     message: `File ${fileDoc.name} was not uploaded properly and could not be validated. Please try again.`,
  //   });
  //   return;
  // }

  // fileDoc.sizeInBytes = fileMetadata.ContentLength || -1;
  // fileDoc.mimetype = fileMetadata.ContentType as Mimetype;
  // fileDoc.src = req.body.file.src;

  // // Check DB for latest information on the user's storage
  // const account = await UserLogic.fetch(Auth.user?.id || "");
  // validateAccountHasSpace(account, fileDoc.sizeInBytes);

  // account.storageUsed = (account.storageUsed || 0) + fileDoc.sizeInBytes;

  // // Save in this order. We would rather have the user be using more space than recorded until
  // // we review and adjust storage used. This shouldn't happen, but we want to err towards user
  // // quality of life
  // const file = await FileLogic.updateValidatedUpload(fileDoc.ref, fileDoc);
  // const updatedUser = await UserLogic.updateStorageUsed(account.ref, account);

  this.returnSuccess({ account: {}, file: {} });
}

export default createEndpoint({POST: validateUpload});

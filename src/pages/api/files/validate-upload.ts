import { s3 } from "@owl-factory/aws/s3";
import { RequireLogin } from "@owl-factory/database/decorators/modifiers";
import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { Auth } from "controllers/auth";
import { NextApiRequest } from "next";
import { FileLogic } from "server/logic/FileLogic";
import { UserLogic } from "server/logic/UserLogic";
import { requireLogin, requirePermission, validateAccountHasSpace } from "utilities/validation/account";

/**
 * Validates the successful upload of a file
 * @param req The request containing a body with a file document 'doc'
 */
async function validateUpload(this: HTTPHandler, req: NextApiRequest) {
  // Checks aren't strictly required, but it is better to spend a little time verifying the user
  // has access than pinging the database on each run
  requireLogin();
  requirePermission("uploadFile");

  const fileDoc = await FileLogic.findOne(req.body.file.ref);
  // If we're not pending, then there is nothing to be done. Exit.
  if (!fileDoc.isPending) {
    this.returnSuccess({ file: fileDoc });
    return;
  }

  const fileMetadata = await s3.getObjectMetadata(fileDoc.s3Path || "");

  // Check DB for latest information on the user's storage
  const user = await UserLogic.findOne(Auth.user?.ref || "");
  validateAccountHasSpace(user, req.body.doc.sizeInBytes);

  const doc = await FileLogic.createUpload(req.body.doc);
  const uploadURL = await s3.generateUploadURL(doc.s3Path || "", doc.mimetype);

  this.returnSuccess({ uploadURL, doc });
}

export default createEndpoint({PUT: validateUpload});

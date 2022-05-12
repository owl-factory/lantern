import { s3 } from "@owl-factory/aws/s3";
import { RequireLogin } from "@owl-factory/database/decorators/modifiers";
import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { Auth } from "controllers/auth";
import { NextApiRequest } from "next";
import { FileLogic } from "server/logic/FileLogic";
import { UserLogic } from "server/logic/UserLogic";
import { requireLogin, requirePermission, validateAccountHasSpace } from "utilities/validation/account";

/**
 * Prepares for the upload of a file. Creates a pending document in the database and generates
 * an upload URL for AWS
 * @param req The request containing a body with a file document 'doc'
 */
async function beginUpload(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();
  requirePermission("uploadFile");

  // Check DB for latest information on the user's storage
  const user = await UserLogic.findOne(Auth.user?.ref || "");
  validateAccountHasSpace(user, req.body.doc.sizeInBytes);

  const doc = await FileLogic.createUpload(req.body.doc);
  const uploadURL = await s3.generateUploadURL(doc.s3Path || "", doc.mimetype);

  this.returnSuccess({ uploadURL, doc });
}

export default createEndpoint({PUT: beginUpload});

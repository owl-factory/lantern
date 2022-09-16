import { s3 } from "@owl-factory/aws/s3";
import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import { Auth } from "controllers/auth";
import { NextApiRequest } from "next";
import { requireLogin, validateAccountHasSpace } from "utilities/validation/account";

/**
 * Prepares for the upload of a file. Creates a pending document in the database and generates
 * an upload URL for AWS
 * @param req The request containing a body with a file document 'doc'
 */
async function beginUpload(this: HTTPHandler, req: NextApiRequest) {
  requireLogin();

  // Check DB for latest information on the user's storage
  // const user = await UserLogic.fetch(Auth.user?.id || "");
  // validateAccountHasSpace(user, req.body.doc.sizeInBytes);

  // const file = await FileLogic.createUpload(req.body.doc);
  // const uploadURL = await s3.generateUploadURL(file.s3Path || "", file.mimetype);

  this.returnSuccess({ uploadURL: "", file: {} });
}

export default createEndpoint({PUT: beginUpload});

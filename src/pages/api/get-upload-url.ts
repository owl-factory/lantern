import "reflect-metadata";
import { NextApiRequest } from "next";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { typeRegex } from "utilities/image-upload";

const urlExpirationSeconds = 300;
const extentionMap: any = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const s3 = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_S3_KEY || "",
    secretAccessKey: process.env.AWS_S3_SECRET || "",
  },
});

/**
 * Gets a signed upload URL from S3
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getUploadURL(this: HTTPHandler, req: NextApiRequest) {
  const owner = req.body.owner;
  const image = req.body.image;
  const type = req.body.type;

  console.log(req.body);

  if (!typeRegex.test(type)) {
    this.returnError(400, "Wrong file type.");
    return;
  }

  const key = `${owner}/${image}/full.${(extentionMap[type])}`;

  const params = {
    Bucket: process.env.AWS_S3_IMAGE_BUCKET || "",
    Key: key,
    ContentType: type,
  };

  const command = new PutObjectCommand(params);

  const url = await getSignedUrl(s3, command, { expiresIn: urlExpirationSeconds });

  this.returnSuccess({ url });
}

export default createEndpoint({POST: getUploadURL});

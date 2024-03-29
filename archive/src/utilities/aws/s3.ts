import { HeadObjectCommand, HeadObjectCommandOutput, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { isClient } from "utilities/client";

let S3_CLIENT: S3Client | null = null; // The AWS S3 client
const S3_BUCKET = process.env.AWS_S3_IMAGE_BUCKET || ""; // The name of the bucket in S3 to upload to
const URL_EXPIRATION_SECONDS = 300; // The time in seconds until the S3 upload URL expires

/**
 * Returns an S3 client. Returns an existing one if already present
 * @throws An error if this function is run client-side
 * @returns The created S3 client
 */
function getS3Client(): S3Client {
  if (isClient) { throw "The AWS S3 client is not available on client-side"; }
  if (!S3_CLIENT) {
    S3_CLIENT = new S3Client({
      region: process.env.AWS_S3_REGION || "us-east-2",
      credentials: {
        accessKeyId: process.env.AWS_S3_KEY || "",
        secretAccessKey: process.env.AWS_S3_SECRET || "",
      },
    });
  }
  return S3_CLIENT;
}

/**
 * Generates a URL that can be used to upload a single object to AWS.
 * @param path The path to place the file object in
 * @param mimetype The mimetype of file being uploaded
 * @returns The generated upload URL
 */
async function generateUploadURL(path: string, mimetype: string) {
  if (!path) { throw "A valid path is required for generating an S3 upload URL"; }
  const client = getS3Client();
  const params = {
    Bucket: S3_BUCKET,
    Key: path,
    ContentType: mimetype,
  };

  const command = new PutObjectCommand(params);
  const uploadURL = await getSignedUrl(client, command, { expiresIn: URL_EXPIRATION_SECONDS });
  return uploadURL;
}

/**
 * Fetches an object's metadata from an AWS S3 bucket
 * @param path The path to the place that the file is located
 * @returns The object metadata, if found. If no object is found, returns undefined
 */
async function getObjectMetadata(path: string): Promise<HeadObjectCommandOutput | undefined> {
  if (!path) { throw "A valid path is required to fetch an object's metadata from the S3 bucket"; }
  const client = getS3Client();
  const params = {
    Bucket: S3_BUCKET,
    Key: path,
  };

  const command = new HeadObjectCommand(params);
  try {
    const fileMetadata = await client.send(command);
    return fileMetadata;
  } catch (e: any) {
    if (!e.$response || !e.$response.statusCode) {
      // TODO - Log error
      throw `An unexpected error occured when attempting to read object metadata from the AWS S3 bucket`;
    }

    if (e.$response.statusCode === 404) { return undefined; }
    else { throw e; }
  }
}

/**
 * Uploads a single file into an S3 bucket using the given URL
 * @param url The limited-time URL to upload the file into an S3 bucket
 * @param file The file to upload
 * @returns
 */
async function upload(url: string, file: File) {
  // TODO - add typing for response
  return await fetch(url, { method: "PUT", body: file });
}

export const s3 = {
  generateUploadURL,
  getObjectMetadata,
  upload,
};

import { gql } from "@apollo/client";
import { s3 } from "@owl-factory/aws/s3";
import { Asset, Prisma } from "@prisma/client";
import { apolloClient } from "graphql/apollo-client";
import { Mimetype, mimetypeToTypeMap } from "types/enums/files/mimetypes";
import { FileType } from "types/enums/files/type";
import { requireLogin } from "utilities/validation/account";
import { validateAssetUploadCreationDoc, validateRawFile } from "utilities/validation/file";
import { FormValues } from "../types";

const BEGIN_ASSET_UPLOAD = gql`
  mutation BeginAssetUpload($asset: AssetUploadInput!) {
    uploadAsset(asset: $asset) {
      asset {
        id, name, s3Key, s3Path, isS3Pending,
      },
      uploadURL
    }
  }
`;

const DELETE_FAILED_ASSET = gql`
  mutation DeleteFailedAsset($id: String!) {
    deleteFailedAsset(id: $id)
  }
`;

const VALIDATE_ASSET = gql`
  mutation ValidateAsset($id: String!, $asset: AssetValidateInput) {
    validateAsset(id: $id, asset: $asset) {
      id, name, isS3Pending
    }
  }
`;

/**
 * Builds the required metadata configuration
 * @param asset The asset being saved
 * @param auxData The auxilliary data dependent on what kind of asset is being uploaded
 * @returns Additional configuration data for the backend
 */
function buildConfig(asset: Partial<Asset>, auxData: any): Prisma.JsonValue {
  const config: Prisma.JsonValue = {}; // JsonValue is equivalent to a Record<string, unknown>
  switch(asset.assetType) {
    case FileType.Image as any:
      config.height = auxData.height as number || 0;
      config.width = auxData.width as number || 0;
      break;
  }
  return config;
}

/**
 * Requests an upload from the server.
 * @param asset The asset to notify the server that we are beginning to upload
 */
async function requestUploadFromServer(asset: Partial<Asset>) {
  try {
    const res = await apolloClient.mutate({ mutation: BEGIN_ASSET_UPLOAD, variables: { asset } });
    return res.data;
  } catch (e) {
    // TODO - better error
    console.error(e);
    throw `An unexpected error occured while attempting to begin a file upload.`;
  }
}

/**
 * Uploads a file to S3
 * @param uploadURL The URL to attempt uploading the file to
 * @param file The file to upload
 * @returns The successful upload response
 */
async function uploadAssetToS3(uploadURL: string, file: File) {
  try {
    const awsRes = await s3.upload(uploadURL, file);
    return awsRes;
  } catch (e: any) {
    // We don't need to wait for this. If it fails, a cleanup action can take care of this
    throw "The file failed to upload successfully";
  }
}

/**
 * Validates that an asset was successfully uploaded
 * @param id The ID of the asset to validate
 */
async function validateAssetUpload(id: string) {
  try {
    const res = await apolloClient.mutate({ mutation: VALIDATE_ASSET, variables: { id } });
    return res;
  } catch (e) {
    throw "Error validating that the file was successfully uploaded";
  }
}

/**
 * Handles submitting the form for uploading a file
 * @param values The asset and any auxilliary data included with the form submission
 */
export async function uploadAsset(values: FormValues) {
  // Validate user
  requireLogin();
  validateRawFile(values.file);

  // Should be caught by validateRawFile, but present for safety and typing
  if (!values.file) { return; }

  const asset: Partial<Asset> = {
    name: values.file.name.replace(/.*?[\\/]/, ""),
    mimetype: values.file.type as Mimetype,
    assetType: (mimetypeToTypeMap as Record<string, FileType>)[values.file.type] as any,
    sizeInBytes: values.file.size, // We do not guarantee this number is correct
  };

  asset.config = buildConfig(asset, values.auxData);

  // Validate data
  validateAssetUploadCreationDoc(asset);

  // Begin upload via graphql endpoint
  const upload: { asset: Asset, uploadURL: string } = await requestUploadFromServer(asset);
  // Upload to AWS
  // TODO - move into its own function?
  try {
    const _awsRes = await uploadAssetToS3(upload.uploadURL, values.file);
  } catch (e) {
    // Doesn't need the await or a check. If this fails to clean up there will be a function to a
    apolloClient.mutate({ mutation: DELETE_FAILED_ASSET, variables: { id: upload.asset.id }});
    throw e;
  }
  const validateResult = await validateAssetUpload(upload.asset.id);
  return validateResult.data.asset;
}

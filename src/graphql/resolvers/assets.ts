import { s3 } from "@owl-factory/aws/s3";
import { Asset, User } from "@prisma/client";
import { Auth } from "controllers/auth";
import { Mimetype } from "types/enums/files/mimetypes";
import { generateS3Filepath, generateS3Key } from "utilities/files";
import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// The where clause of *many queries
interface AssetWhere {
  id?: string;
}

// Any additional documents to return
type AssetInclude = {};


// The fields to create a new Asset
interface AssetUploadInput {
  name: string;
  mimetype: string;
  assetType: string;
  sizeInBytes: number;
}

// The mutatable fields of  the asset
interface AssetMutateInput {
  name: string;
}

interface GetAssetsArguments {
  where: AssetWhere;
  include: AssetInclude
}

interface GetAssetArguments {
  id: string;
  include: AssetInclude;
}

interface UploadAssetArguments {
  asset: AssetUploadInput;
  include: AssetInclude;
}

interface ValidateAssetArguments {
  id: string;
  asset: Partial<Asset>;
}

interface MutateAssetArguments {
  id: string;
  asset: AssetMutateInput;
  include: AssetInclude;
}

/**
 * Gets a list of assets
 * @param where The where clause of the query
 * @param include Any additional documents to include
 * @returns A list of assets
 */
async function getAssets(_: unknown, { where, include }: GetAssetsArguments) {
  return prisma.asset.findMany({ where, include });
}

/**
 * Gets a single asset
 * @param id The ID of the asset to fetch
 * @param include Any additional documents to include
 * @returns Gets a single action
 */
async function getAsset(_: unknown, { id, include }: GetAssetArguments) {
  return prisma.asset.findUnique({
    where: { id },
    include,
  });
}

/**
 * Begins an asset upload to Amazon S3
 * @param asset The initial asset to upload
 * @param include Any additional documents to include in the response
 * @returns The initial asset upload
 */
async function uploadAsset(_: unknown, { asset, include }: UploadAssetArguments) {
  // TODO - Ensure the user has space
  const s3Key = generateS3Key();
  const s3Path = generateS3Filepath(Auth.user as User, { s3Key, mimetype: asset.mimetype });

  const newAsset = await prisma.asset.create({
    data: {
      ...asset,
      src: "",
      s3Key,
      s3Path,
      isS3Pending: true,
    },
    include,
  });
  const uploadURL = await s3.generateUploadURL(newAsset.s3Path || "", newAsset.mimetype);
  return { asset: newAsset, uploadURL };
}

/**
 * Validates an asset uploaded to Amazon S3
 * @param id The ID of the asset to validate
 * @returns The validated asset
 */
async function validateAsset(_: unknown, { id, asset }: ValidateAssetArguments) {
  // TODO - validate login

  // Validate that the asset document exists and that it
  const existingAsset = await prisma.asset.findUnique({ where: { id } });
  if (!existingAsset) { throw `The file validation failed. No file could be found.`; }
  else if (existingAsset.isS3Pending === false) { return existingAsset; }

  // Fetches the metadata from S3
  const fileMetadata = await s3.getObjectMetadata(existingAsset.s3Path || "");
  if (!fileMetadata) {
    prisma.asset.delete({ where: { id }});
    throw `${existingAsset.name} could not be successfully uploaded. Please try again.`;
  }

  asset.sizeInBytes = fileMetadata.ContentLength || -1;
  asset.mimetype = fileMetadata.ContentType as Mimetype;

  // Validates
  return prisma.asset.update({
    data: { isS3Pending: false },
    where: { id },
  });
}

/**
 * Mutates a single asset
 * @param id The ID of the asset to mutate
 * @param asset The changes to make on the asset
 * @param include Any additional documents to include
 * @return The mutated asset
 */
async function mutateAsset(_: unknown, { id, asset, include }: MutateAssetArguments) {
  return prisma.asset.update({
    data: asset,
    where: { id },
    include,
  });
}

export const assetResolvers = {
  Query: {
    assets: getAssets,
    asset: getAsset,
  },
  Mutation: {
    uploadAsset,
    validateAsset,
    mutateAsset,
  },
};

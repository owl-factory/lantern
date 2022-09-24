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
  fileType: string;
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
  return prisma.file.findMany({ where, include });
}

/**
 * Gets a single asset
 * @param id The ID of the asset to fetch
 * @param include Any additional documents to include
 * @returns Gets a single action
 */
async function getAsset(_: unknown, { id, include }: GetAssetArguments) {
  return prisma.file.findUnique({
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
  return prisma.file.create({
    data: {
      ...asset,
      src: "",
      s3Key: "...",
      s3Path: "...",
      isS3Pending: true,
    },
    include,
  });
}

/**
 * Validates an asset uploaded to Amazon S3
 * @param id The ID of the asset to validate
 * @returns The validated asset
 */
async function validateAsset(_: unknown, { id }: ValidateAssetArguments) {
  return prisma.file.update({
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
  return prisma.file.update({
    data: asset,
    where: { id },
    include,
  });
}


export const assetResolvers = {
  Query: {
    files: getAssets,
    file: getAsset,
  },
  Mutation: {
    uploadAsset,
    validateAsset,
    mutateFile: mutateAsset,
  },
};

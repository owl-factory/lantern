import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

async function getAssets(_: unknown, { where, include }: GetAssetsArguments) {
  return prisma.file.findMany({ where, include });
}

async function getAsset(_: unknown, { id, include }: GetAssetArguments) {
  return prisma.file.findUnique({
    where: { id },
    include,
  });
}

async function uploadAsset(_: unknown, { asset, include }: UploadAssetArguments) {
  return prisma.file.create({
    data: asset,
    include,
  });
}

async function validateAsset(_: unknown, { id }: ValidateAssetArguments) {
  return prisma.file.update({
    data: { isS3Pending: false },
    where: { id },
  });
}

async function mutateAsset(_: unknown, { id, asset, include }: MutateAssetArguments) {
  return prisma.
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

import { gql } from "apollo-server-micro";

export const assetTypeDefs = gql`
  type Asset {
    id: String

    name: String
    src: String
    mimetype: String
    assetType: String
    sizeInBytes: Int
    s3Key: String
    s3Path: String
    isS3Pending: Boolean
    config: Json

    ownedBy: String
    owner: User
    createdAt: Date
    createdBy: String
    creatingUser: User
    updatedAt: Date
    updatedBy: String
    updatingUser: User
    deletedAt: Date
    deletedBy: String
    deletingUser: User
  }

  # The where clause for *many queries
  input AssetWhere {
    id: String
  }

  # Any additional documents to include in the response
  input AssetInclude {}

  # Describes the fields used in creating an asset upload
  input AssetUploadInput {
    name: String!
    fileType: String!
    mimetype: String!
    assetType: String!
    sizeInBytes: Int!
  }

  # The fields used for mutating an asset
  input AssetMutateInput {
    name: String
  }

  Query {
    assets(where: AssetWhere, include: AssetInclude): [Asset]
    asset(id: String!, include: AssetInclude): Asset
  }
  Mutation {
    uploadAsset(asset: AssetUploadInput!, include: AssetInclude): Asset
    validateAsset(id: String!): Asset
    mutateAsset(id: String!, asset: AssetMutateInput!, include: AssetInclude): Asset
  }
`;

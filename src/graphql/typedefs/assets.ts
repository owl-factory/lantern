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
  input AssetInclude {
    ownedBy: Boolean
  }

  # Describes the fields used in creating an asset upload
  input AssetUploadInput {
    name: String!
    mimetype: String!
    assetType: String!
    sizeInBytes: Int!
    config: Json!
  }

  # Any additional fields required for the asset validation
  input AssetValidateInput {
    src: String!
  }

  # The fields used for mutating an asset
  input AssetMutateInput {
    name: String
  }

  type AssetUploadResponse {
    asset: Asset!
    uploadURL: String!
  }

  type Query {
    assets(where: AssetWhere, include: AssetInclude): [Asset]
    asset(id: String!, include: AssetInclude): Asset
  }

  type Mutation {
    uploadAsset(asset: AssetUploadInput!, include: AssetInclude): AssetUploadResponse
    validateAsset(id: String!, asset: AssetValidateInput!): Asset
    mutateAsset(id: String!, asset: AssetMutateInput!, include: AssetInclude): Asset
  }
`;

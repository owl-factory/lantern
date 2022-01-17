export enum AssetSource {
  Upload = 0, // Indicates that this asset was uploaded
  InternalLink, // Indicates that this asset is linked from another internal image
  ExternalLink, // Indicates that this asset is linked from an external site
  Purchased, // Indicates that this asset was purchased internally
  Created, // Indicates that this asset was created using an internal Reroll tool
}

export enum AssetUploadSource {
  Select = -1, // Indicates that this asset is being selected from a pre-existing
  Upload = 0, // Indicates that this asset was uploaded
  InternalLink, // Indicates that this asset is linked from another internal image
  ExternalLink, // Indicates that this asset is linked from an external site
  Purchased, // Indicates that this asset was purchased internally
  Created, // Indicates that this asset was created using an internal Reroll tool
}

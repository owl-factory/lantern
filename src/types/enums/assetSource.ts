// Different possible sources for an asset
export enum AssetSource {
  Upload, // The value if a file has been uploaded by a user
  InternalLink, // The value if a file is another asset but is linked
  ExternalLink // The value if an external asset is linked from outside of the site
}

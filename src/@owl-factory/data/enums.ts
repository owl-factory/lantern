
// The method for where the Data Manager will store data
// Currently not implemented
export enum CacheMethod {
  LocalStorage,
}

// The policy for how the DataManager will reload a document if the document is already loaded
export enum ReloadPolicy {
  Never, // Never reloads the document if it is already loaded in
  IfStale, // Reloads the document when the document has become stale
  Always, // Always reloads the document when called, even if already loaded in
}

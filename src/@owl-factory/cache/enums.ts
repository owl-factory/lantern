// A set of different levels for when the cache should passively refresh a document
export enum PassiveReadLevel {
  Never,
  IfUnloaded,
  IfStale,
  Force
}

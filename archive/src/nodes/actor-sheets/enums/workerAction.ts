// Defines the different actions that may be taken on the Sandboxed Web Worker
export enum WorkerAction {
  Expression="expression", // Indicates that this is a message to parse
  Set="set", // Indicates that this message is to set a value
}

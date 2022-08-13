
// The contents of the message sent to the Mediator and it's handler functions
export type MediatorContents = Record<string, unknown> & StaticMediatorContents;
// The static, required parts of the Mediator Contents
type StaticMediatorContents = {}

// The different kinds of actions that can be sent to a mediator
export enum MediatorMessage {
  Roll, // Indicates that a roll has been made
}

// The different kinds of requests that can be made to other controllers via the mediator
export enum MediatorRequest {
  Sandbox,
}

// Defines the different kinds of MediatorMessages and the actions to take. 
// The complicated type is similar to Record<MediatorMessage, () => unknown>, but makes each entry optional
export type MediatorHandler = {
  [K in (MediatorMessage | MediatorRequest)]?: (contents: MediatorContents) => unknown | Promise<unknown> 
};

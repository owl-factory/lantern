
// The contents of the message sent to the Mediator and it's handler functions
export type MediatorContents = Record<string, unknown> & StaticMediatorContents;
// The static, required parts of the Mediator Contents
interface StaticMediatorContents {
  source: string;
}

// The different kinds of actions that can be sent to a mediator
export enum MediatorMessage {
  Roll, // Indicates that a roll has been made
}

// Defines the different kinds of MediatorMessages and the actions to take. 
// The complicated type is similar to Record<MediatorMessage, () => unknown>, but makes each entry optional
export type MediatorHandler = { [K in MediatorMessage]?: (contents: MediatorContents) => unknown | Promise<unknown> };

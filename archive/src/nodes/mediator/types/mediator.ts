
// The contents of the message sent to the Mediator and it's handler functions
export type MediatorContents = Record<string, unknown> & StaticMediatorContents;
// The static, required parts of the Mediator Contents
interface StaticMediatorContents {
  source: string;
}

// The different kinds of actions that can be posted to a mediator
export enum MediatorPost {
  Default=0,
  Chat, // Indicates a chat message has been posted by the current user
  Roll, // Indicates that a roll has been made
  SetSandbox, // Sets data in the sandbox expr
}

// The different kinds of actions that can be requested via a mediator
export enum MediatorRequest {
  Default=1000,
  ChatActors,
  ChatMessages,
  SandboxExpr, // Renders an expression using the sandbox controller expression
}

// Defines the different kinds of MediatorMessages and the actions to take.
// The complicated type is similar to Record<MediatorMessage, () => unknown>, but makes each entry optional
export type MediatorHandler = {
  [K in (MediatorPost | MediatorRequest)]?: (contents: MediatorContents) => unknown | Promise<unknown>
};

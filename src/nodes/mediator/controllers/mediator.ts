import { MediatorContents, MediatorHandler, MediatorPost, MediatorRequest } from "../types/mediator";

/**
 * The base Mediator class used for communication between different
 */
export class $Mediator {
  // Mapping between the MediatorMessage enum and actions to take
  protected handler: MediatorHandler = {};

  /**
   * Sets a new handler for a specifc page
   * @param handler The new Mediator Handler for use on a specific page
   */
  public set(handler: MediatorHandler) {
    this.handler = handler;
  }

  /**
   * Resets the handler to a neutral state
   */
  public reset() { this.handler = {}; }

  /**
   * Posts a message to the mediator, which runs it through the appropriate handler
   * @param message The type of message this post is making
   * @param contents The contents of the message
   */
  public post(message: MediatorPost, contents: Partial<MediatorContents>) {
    this.run(message, contents);
  }

  /**
   * Requests data via the mediator, which retrieves it using the appropriate handler
   * @param message The type of request being made
   * @param contents The contents of the message
   * @returns A possible value from another controller within a promise. Returns 'null' if it fails
   */
  public async requests(message: MediatorRequest, contents: Partial<MediatorContents>): Promise<unknown> {
    return this.run(message, contents);
  }

  /**
   * Runs a type of message through the specificed handler and returns the result, if any
   * @param message The type of message to run and handle
   * @param contents The contents of the post or request message
   * @returns A value from the handler function, if any
   */
  public async run(message: MediatorRequest | MediatorPost, contents: Partial<MediatorContents>): Promise<unknown> {
    const handler = this.handler[message];
    if (handler === undefined) {
      // TODO - do something?
      return null;
    }
    try {
      return handler(contents as MediatorContents);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export const Mediator = new $Mediator();

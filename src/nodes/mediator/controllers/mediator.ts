import { MediatorContents, MediatorHandler, MediatorMessage, MediatorRequest } from "../types/mediator";

/**
 * The base Mediator class used for communication between different
 */
export class $Mediator {
  // Mapping between the MediatorMessage enum and actions to take
  protected handler: MediatorHandler = {};

  public set(handler: MediatorHandler) {
    this.handler = handler;
  }

  public reset() { this.handler = {}; }

  /**
   * Requests data from another controller
   * @param requestType The type of message sent to another service to recieve data back
   * @param contents The contents of the request
   */
  public async request(requestType: MediatorRequest, contents: Partial<MediatorContents>): Promise<unknown> {
    const handler = this.handler[requestType];
    if (handler === undefined) { return; }
    try {
      return handler(contents as MediatorContents);
    } catch (e) {
      console.error(e);
      return;
    }
  }

  /**
   * Posts a message to the mediator, which handles sending the message to the appropriate controllers
   * @param message The type of message this post is making
   * @param contents The contents of the message
   */
  public post(message: MediatorMessage, source: string, contents: Partial<MediatorContents>): void {
    contents.source = source;
    const handler = this.handler[message];
    if (handler === undefined) { return; }
    try {
      handler(contents as MediatorContents);
      return;
    } catch (e) {
      console.error(e);
      return;
    }
  }
}

export const Mediator = new $Mediator();

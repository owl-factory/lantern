import { Ref64 } from "@owl-factory/types";
import { action, makeObservable, observable } from "mobx";
import { Mediator } from "nodes/mediator";
import { MediatorPost, MediatorRequest } from "nodes/mediator/types/mediator";
import { OldMessageDocument } from "types/documents";
import { ActorDocument } from "types/documents/Actor";
import { ChatMessage } from "../types/message";
import { parseChatMessage } from "../utilities/message";

// Controller for handling chat functionality specifically
class $ChatController {
  public $messages: ChatMessage[] = [];
  public $actors: ActorDocument[] = [];

  constructor() {
    makeObservable(this, {
      $actors: observable,
      $messages: observable,
      add: action,
      post: action,
      fetchActors: action,
      fetchMessages: action,
    });
  }

  // Gets the actors used for selecting who the message is sending as
  get actors(): ActorDocument[] {
    return this.$actors;
  }

  // Gets the current collection of messages
  get messages(): ChatMessage[] {
    return this.$messages;
  }

  /**
   * Fetches the list of actors that the user may submit a message as
   */
  public async fetchActors() {
    try {
      const actors = (await Mediator.requests<ActorDocument[]>(MediatorRequest.ChatActors, {})) || [];
      this.$actors = actors;
    } catch (e) {
      console.error("Chat Controller Exception: The actors failed to fetch. " + e);
    }
  }

  /**
   * Fetches the list of messages to render unto the page
   */
  public async fetchMessages() {
    try {
      const messages = (await Mediator.requests<OldMessageDocument[]>(MediatorRequest.ChatMessages, {})) || [];
      // TODO - handling and conversion of messages
      this.$messages = [];
    } catch (e) {
      console.error("Chat Controller Exception: The actors failed to fetch. " + e);
    }
  }

  /**
   * Adds a pre-formated message to the chat
   * @param message The pre-formated message to add to the chat
   */
  public add(message: ChatMessage) {
    this.messages.push(message);
  }

  /**
   * Posts a message from the chat form to the chat log, as well as sending it to the mediator
   * for any necessary distribution
   * @param message The text message to post to the chat
   */
  public post(values: any) {
    const parsedMessage = parseChatMessage(values);
    this.add(parsedMessage);
    Mediator.post(MediatorPost.Chat, { message: parsedMessage });
  }
}

export const ChatController = new $ChatController();

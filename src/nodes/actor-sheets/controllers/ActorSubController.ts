import { Ref64 } from "@owl-factory/types";
import { action, makeObservable, observable, toJS } from "mobx";
import { Scalar } from "types";
import { ActorContent, ActorDocument } from "types/documents/Actor";

/**
 * A sub controller for managing the actors within an ActorController
 */
export class ActorSubController {
  public $actorValues: Record<string, Record<string, Scalar>> = {};
  public $actorFields: Record<string, Record<string, unknown>> = {};
  public $content: Record<string, Record<string, ActorContent[]>> = {};

  constructor() {
    this.$actorValues = {};
    this.$actorFields = {};
    this.$content = {};

    makeObservable(this, {
      $actorValues: observable,
      $actorFields: observable,
      $content: observable,

      setActorFieldValue: action,
      loadActor: action,
      generateFields: action,
      unloadActor: action,

      setContent: action,
    });
  }

  /**
   * Grabs the values for an actor
   * @param ref The ref of the actor to fetch
   * @returns The found actor values or an empty struct
   */
  public getActorValues(ref: string): Record<string, Scalar> {
    const actor = this.$actorValues[ref];
    if (!actor) { return {}; }
    return actor;
  }

  /**
   * Gets the value of a single actor field
   * @param ref The ref of the render this actor is a part of
   * @param fieldName The name of the field being fetched
   * @returns The value of the field. Undefined if not present
   */
  public getActorFieldValue(ref: string, fieldName: string) {
    const actor = this.getActorValues(ref);
    if (!(fieldName in actor)) { return undefined; }
    return actor[fieldName];
  }

  /**
   * Sets a value to a single actor field
   * @param ref The ref of the render the target actor is a part of
   * @param fieldName The nam of the field being fetched
   * @param value The new value to save to the field
   */
  public setActorFieldValue(ref: string, fieldName: string, value: any) {
    if (!this.isActorLoaded(ref)) { return; }
    this.$actorValues[ref][fieldName] = value;
  }

  /**
   * Grabs a specific list of content for an actor 
   * @param ref The ref of the actor to grab the content from
   * @param contentKey The key of the content to fetch
   * @returns An array of the content. Returns an empty array if nothing is found
   */
  public getContent(ref: string, contentKey: string): ActorContent[] {
    if (!this.isActorLoaded(ref)) { return []; }
    const content = this.$content[ref][contentKey] || [];
    return content;
  }

  /**
   * Updates the content of a specific actor and content type
   * @param ref The ref of the actor to set the new content within
   * @param contentKey The content group that is being updated
   * @param content The new list of content to be stored
   */
  public setContent(ref: string, contentKey: string, content: ActorContent[]) {
    if (!this.isActorLoaded(ref)) { return []; }
    this.$content[ref][contentKey] = content;
  }

  /**
   * Loads in an actor to the actor controller
   * @param ref The ref of the actor being loaded in
   * @param values The actor's data values
   */
  public loadActor(ref: string, actor: Partial<ActorDocument>) {
    this.$actorValues[ref] = actor.values || {};
    this.generateFields(ref);
    this.$content[ref] = actor.content || {};
  }

  /**
   * Pushes a new content item to a list of content for an actor and content type
   * @param ref The ref of the actor getting a new content item
   * @param contentGroup The content type the new item is being added to
   * @param newContent Optionally defined content being added. If none is given, defaults will be provided
   */
  public pushNewContent(ref: string, contentGroup: string, newContent?: ActorContent) {
    const contents = this.getContent(ref, contentGroup);
    newContent = normalizeActorContent(ref, contentGroup, newContent);
    contents.push(newContent);
    this.setContent(ref, contentGroup, contents);
  }

  /**
   * Unloads an actor from the actor controller
   * @param ref The ref of the actor to unload
   * @returns True if an actor was found. Returns false if not.
   */
  public unloadActor(ref: string): boolean {
    const actor = this.$actorValues[ref];
    delete this.$actorValues[ref];
    delete this.$actorFields[ref];
    return (actor !== undefined);
  }

  /**
   * Determines if an actor with the given ref is currently loaded.
   * @param ref The ref of the actor to check
   * @returns True if the actor is present and loaded. False otherwise
   */
  public isActorLoaded(ref: string): boolean {
    return (this.$actorValues[ref] !== undefined);
  }

  /**
   * Determines the type for each of the actor's fields
   * @param ref The ref of the actor to generate the fields for
   */
  public generateFields(ref: string) {
    const actor = this.$actorValues[ref];
    if (!actor) {
      this.unloadActor(ref);
      return;
    }

    this.$actorFields[ref] = {};

    const actorFields = Object.keys(actor);
    for (const actorField of actorFields) {
      const value = actor[actorField];
      const type = determineType(value);
      this.$actorFields[ref][actorField] = type;
    }
  }
}

/**
 * Parses a given value into a useable type for actors
 * @param value The actor value to parse into a type
 * @todo Implement
 */
function determineType(value: unknown) {
  return "string";
}

/**
 * Normalizes the actor content by ensuring that all fields are present and have reasonable defaults
 * @todo Implement once content types are further hashed out
 * @param actorRef The ref of the actor this content is being added to
 * @param contentGroup The type of content being added
 * @param content An optional definition of the new content being added. If none is provided, defaults will be set
 *  based off of the content type
 */
function normalizeActorContent(actorRef: Ref64, contentGroup: string, content?: ActorContent) {
  if (!content) { content = { values: {} }; }
  // TODO - implement loading in default values for the content type fields
  return content;
}

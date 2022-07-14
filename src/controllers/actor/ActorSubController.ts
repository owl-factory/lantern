import { action, makeObservable, observable, toJS } from "mobx";

/**
 * A sub controller for managing the actors within an ActorController
 */
export class ActorSubController {
  public $actorValues: Record<string, Record<string, unknown>> = {};
  public $actorFields: Record<string, Record<string, unknown>> = {};

  constructor() {
    this.$actorValues = {};
    this.$actorFields = {};

    makeObservable(this, {
      $actorValues: observable,
      $actorFields: observable,

      setActorFieldValue: action,
      loadActor: action,
      generateFields: action,
      unloadActor: action,
    });
  }

  /**
   * Grabs the values for an actor
   * @param ref The ref of the actor to fetch
   * @returns The found actor values or an empty struct
   */
  public getActorValues(ref: string): Record<string, unknown> {
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
   * Loads in an actor to the actor controller
   * @param ref The ref of the actor being loaded in
   * @param values The actor's data values
   */
  public loadActor(ref: string, values: Record<string, unknown>) {
    this.$actorValues[ref] = values;
    this.generateFields(ref);
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


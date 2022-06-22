import { action, makeObservable, observable, toJS } from "mobx";

export class ActorSubController {
  public $actorValues: Record<string, Record<string, unknown>> = {};
  public $actorFields: Record<string, Record<string, unknown>> = {};

  constructor() {
    this.$actorValues = {};
    this.$actorFields = {};

    makeObservable(this, {
      $actorValues: observable,
      $actorFields: observable,

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


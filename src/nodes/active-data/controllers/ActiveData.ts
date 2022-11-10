import { gql } from "@apollo/client";
import { Actor, Ruleset } from "@prisma/client";
import { action, makeObservable, observable, runInAction } from "mobx";
import { apolloClient } from "src/graphql/apollo-client";
import { Scalar } from "types";

type ActorFields = Record<string, Scalar | null>;
type ActorContent = Record<string, Scalar | null>;

// Query to refresh the actor fields and content
const FETCH_ACTOR = gql`
  query RefreshActor($id: String!) {
    actor(id: $id) {
      id, fields, content
    }
  }
`;

// Query to refresh the ruleset rules
const FETCH_RULESET = gql`
  query RefreshRuleset($id: String!) {
    ruleset(id: $id) {
      id, rules
    }
  }
`;

// The default time to wait before automatically updating the backend
const DEFAULT_UPDATE_TIME = 60 * 1000;

class ActiveDataClass {
  public actors: Record<string, ActorFields> = {};
  public content: Record<string, Record<string, ActorContent[]>> = {};
  public actorChangeList: Record<string, boolean> = {}; // Tracks any actors that we have made changes to for updating

  public rules: Record<string, Record<string, unknown>> = {};

  // Tracks field-level changes for merging in two datasets
  public actorChanges: Record<string, ActorFields> = {};

  // Used for automatically saving the data after a small period of time
  protected changeTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

  protected locks: Record<string, true> = {};

  constructor() {
    makeObservable(this, {
      actors: observable,
      content: observable,
      rules: observable,

      refreshActor: action,
      refreshRuleset: action,
      save: action,
      setActor: action,
      setContents: action,
      setContent: action,
      setContentField: action,
    });
  }

  /**
   * Fetches a single field from an actor
   * @param id The ID of the actor to fetch from
   * @param field The field of the actor to fetch
   * @returns The value stored in the actor field. If either the actor or field is not present, returns undefined
   */
  public getActor(id: string, field: string): Scalar | undefined {
    if (this.actors[id] === undefined) { return undefined; }
    const value = this.actors[id][field];
    if (value === null) { return undefined; }
    return value;
  }

  /**
   * Sets a field for an actor
   * @param id The ID of the actor being updated
   * @param field The name of the field being updated
   * @param value The new value for the field. Null removes the value
   */
  public setActor(id: string, field: string, value: Scalar | null): void {
    if (!(id in this.actors)) { this.actors[id] = { }; }
    this.actors[id][field] = value;

    if (!(id in this.actorChanges)) { this.actorChanges[id] = { }; }
    this.actorChanges[id][field] = value;
    this.markActorChange(id);
  }

  /**
   * Fetches all contents from a specific field
   * @param id The ID of the actor to fetch the content from
   * @param field The name of the content to fetch from
   * @returns The value stored in the actor field. If either the actor or field is not present, returns undefined
   */
  public getContents(id: string, field: string): ActorContent[] | undefined {
    if (!(id in this.content)) { return undefined; }
    return this.content[id][field];
  }

  /**
   * Fetches a single piece of content
   * @param id The ID of the actor to fetch the content from
   * @param field The name of the content to fetch from
   * @param index The index of the content to fetch
   * @returns The value stored in the actor field. If either the actor or field is not present, returns undefined
   */
  public getContent(id: string, field: string, index: number): ActorContent | undefined {
    if (!(id in this.content) || !(field in this.content[id])) { return undefined; }
    return this.content[id][field][index];
  }

  /**
   * Gets a field from a specific piece of content
   * @param id The ID of the actor to fetch the content field from
   * @param field The name of the content to fetch from
   * @param index The index of the content to fetch
   * @param contentField The content field to fetch
   * @returns The value within the content's field, if any
   */
  public getContentField(id: string, field: string, index: number, contentField: string): Scalar | undefined {
    if (!(id in this.content) || !(field in this.content[id]) || !(index in this.content[id][field])) {
      return undefined;
    }
    const value = this.content[id][field][index][contentField];
    if (value === null) { return undefined; }
    return value;
  }

  /**
   * Sets a new array of changes for the content
   * @param id The ID of the actor whose contents are being updated
   * @param field The name of the content to update
   * @param value The new array of ActorContent to set
   */
  public setContents(id: string, field: string, value: ActorContent[]) {
    if (!(id in this.content)) { this.content[id] = {}; }
    this.content[id][field] = value;
    this.markActorChange(id);
  }

  /**
   * Sets a content entry for an actor
   * @param id The ID of the actor whose content is being updated
   * @param field The name of the content to update
   * @param index The index of the content entry to update
   * @param value The new content to set
   */
  public setContent(id: string, field: string, index: number, value: ActorContent) {
    if (!(id in this.content)) this.content[id] = {};
    if (!(field in this.content[id])) this.content[id][field] = [];
    this.content[id][field][index] = value;
    this.markActorChange(id);
  }

  /**
   * Sets a field for an actor
   * @param id The ID of the actor whose content is being updated
   * @param field The name of the content to update
   * @param value The new value for the field. Null removes the value
   */
  public setContentField(id: string, field: string, index: number, contentField: string, value: Scalar | null) {
    if (!(id in this.content)) this.content[id] = {};
    if (!(field in this.content[id])) this.content[id][field] = [];
    if (!(index in this.content[id][field])) this.content[id][field][index] = {};
    this.content[id][field][index][contentField] = value;
    this.markActorChange(id);
  }

  /**
   * Fetches a single rule from a given ruleset
   * @param id The ID of the rules to fetch
   * @param field The rule to fetch
   * @returns The contents of the specified rule
   */
  public getRule(id: string, field: string): unknown {
    if (this.rules[id] === undefined) { return undefined; }
    return this.rules[id][field];
  }

  /**
   * Refreshes the actor's data from the Apollo Client
   * @param id The ID of the actor to fetch from Apollo Client
   */
   public async refreshActor(id: string): Promise<void> {
    const actor = await apolloClient.query<{ actor: Actor }>({
      query: FETCH_ACTOR,
      variables: { id },
    });
    // Skip if no actor was found
    if (!actor.data.actor) { return; }
    runInAction(() => {
      this.actors[id] = this.mergeActors(id, actor.data.actor.fields as ActorFields);
      this.content[id] = actor.data.actor.content as Record<string, ActorContent[]>;
    });
  }

  /**
   * Refreshes the ruleset's data from the Apollo Client
   * @param id The ID of the ruleset to fetch from Apollo Client
   */
  public async refreshRuleset(id: string): Promise<void> {
    const ruleset = await apolloClient.query<{ ruleset: Ruleset }>({
      query: FETCH_RULESET,
      variables: { id },
    });

    // Skip if no ruleset was found
    if (!ruleset.data.ruleset) { return; }
    runInAction(() => {
      this.rules[id] = (ruleset.data.ruleset.rules as any).values as Record<string, unknown>;
    });
  }

  /**
   * Locks a document, preventing writes to the database
   * @param id The ID of a document to lock, preventing writes to the database
   */
  public lock(id: string) {
    this.locks[id] = true;
  }

  /**
   * Unlocks a document to be saved again
   * @param id The ID of the document to unlock, allowing for writes to the database
   */
  public unlock(id: string) {
    delete this.locks[id];
  }

  /**
   * Saves and flushes all changes that have been made to the database. Builds the query for each individual actor,
   * submits them, then updates their values in the Active Data to ensure that they are completely up to date
   */
  public async save() {
    let args = ``; // The arguments for the Mutation call
    let mutations = ``; // The full list of individual mutations
    const variables: Record<string, string | Partial<Actor>> = {}; // All of the variables being sent
    const actorChangeIDs = Object.keys(this.actorChangeList);
    this.actorChangeList = {}; // Clear out the actor changes ASAP to prevent race conditions

    // Ensures this function isn't called again by the automatic save
    if (this.changeTimeout) {
      clearTimeout(this.changeTimeout);
      this.changeTimeout = undefined;
    }

    // Build the mutations, arguments, and variables for each actor
    for (let i = 0; i < actorChangeIDs.length; i++) {
      const id = actorChangeIDs[i];
      if (this.locks[id] === true) { continue; }

      args += `$id_${i}: String!, $actor_${i}: ActorMutateInput!, `;
      mutations += `actor_${i}: mutateActor(id: $id_${i}, actor: $actor_${i}) {
        id, name, fields, content
      }
      `;
      variables[`id_${i}`] = id;
      variables[`actor_${i}`] = { fields: this.actors[id], content: this.content[id] };
    }

    // No changes will be made, so we don't need to run the mutation
    if (args.length === 0) { return; }
    args = args.slice(0, -2); // Removes the trailing comma and space

    const fullMutation = gql`
      mutation SaveActiveData(${args}) {
        ${mutations}
      }
    `;

    // Attempt to make the mutations
    let result;
    try {
      result = await apolloClient.mutate<Record<string, Actor>>({ mutation: fullMutation, variables });
    } catch (e) {
      // TODO - do something
      console.error(e);
      return;
    }

    // Catch errors with the query
    if (result.data === null || result.data === undefined) {
      console.error(result.errors);
      return;
    }

    const resultKeys = Object.keys(result.data);
    for (const key of resultKeys) {
      if (key.search("actor") === 0) {
        const actor = result.data[key];
        runInAction(() => {
          this.actors[actor.id] = actor.fields as ActorFields;
          this.content[actor.id] = actor.content as Record<string,ActorContent[]>;
        });
        continue;
      }
    }
  }

  /**
   * Marks an actor as having changed. IDs prefixed with an underscore or locked will not be saved
   * @param id The ID of the actor that has changewd
   */
  protected markActorChange(id: string) {
    if (!id || id[0] === "_" || this.locks[id] === true) return;
    this.actorChangeList[id] = true;
    this.markChange();
  }

  /**
   * Marks a change as having occured, initializing the update timeout function if it is not already
   */
  protected markChange() {
    if (this.changeTimeout) return;
    this.changeTimeout = setTimeout(() => { this.save(); }, DEFAULT_UPDATE_TIME);
  }

  /**
   * Merges together the current database version of the actor fields with the staged changes, if any,
   * and returns the result
   * TODO - move elsewhere to be used with the resolvers
   * @param id The ID of actor to merge
   * @param newFields The new fields being merged in
   * @returns The merged actor fields
   */
  protected mergeActors(id: string, newFields: ActorFields) {
    if (this.actorChangeList[id] === undefined) { return newFields; }
    return { ...newFields, ...this.actorChanges[id] };
  }
}

export const ActiveData = new ActiveDataClass();

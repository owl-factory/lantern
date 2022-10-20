import { gql } from "@apollo/client";
import { Actor } from "@prisma/client";
import { action, makeObservable, observable } from "mobx";
import { apolloClient } from "src/graphql/apollo-client";
import { Scalar } from "types";

type ActorFields = Record<string, Scalar | null>;
type ActorContent = Record<string, Scalar | null>;


const FETCH_ACTOR = gql`
  query RefreshActor($id: String!) {
    actor(id: $id) {
      id, fields, content
    }
  }
`;

class ActiveDataClass {
  public actors: Record<string, ActorFields> = {};
  public content: Record<string, Record<string, ActorContent[]>> = {};

  constructor() {
    makeObservable(this, {
      actors: observable,
      content: observable,

      refreshActor: action,
      setActor: action,
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
    if (!(id in this.actors)) { return undefined; }
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
    this.actors[id] = actor.data.actor.fields as ActorFields;
    this.content[id] = actor.data.actor.content as Record<string, ActorContent[]>;
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
  }
}

export const ActiveData = new ActiveDataClass();

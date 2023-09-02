import { Actor } from "@prisma/client";
import { DataInstance } from "../DataInstance";
import { Scalar } from "types";
import { DocumentNode, gql } from "@apollo/client";
import { apolloClient } from "src/graphql/apollo-client";

type TransformedCharacter = Record<string, Scalar> & { contents: Record<string, unknown> }
type RawCharacter = Pick<Actor, "id" | "fields" | "content">;

const FETCH_QUERY = gql`
  query get_character_for_characterdata($id: String!) {
    actor(id: $id) {
      id, fields, content
    }
  }
`;

const UPDATE_QUERY = gql`
  mutation mutate_character_for_characterdata($id:String!, $actor: ActorMutateInput!) {
    mutateActor(id:$id, actor: $actor) {
      id, name
    }
  }
`;

export class CharacterData extends DataInstance<TransformedCharacter, RawCharacter> {
  constructor(id: string) {
    super(id);
  }

  /**
   * Refreshes the data from the database
   */
  public async refresh(): Promise<void> {
    const rawRefreshedResult = await apolloClient.query<RawCharacter>({
      query: FETCH_QUERY,
      variables: {
        id: this.id,
      },
    });

    // TODO - error handling?

    const transformedData = this.transformFromRaw(rawRefreshedResult.data);
    this.data = transformedData;
  }

  public async flush() {
    const rawRefreshedResult = await apolloClient.mutate<RawCharacter>({
      mutation: UPDATE_QUERY,
      variables: {
        id: this.id,
        actor: this.transformToRaw() as RawCharacter,
      },
    });
  }
}

import { GameSystemModel } from "@reroll/model/dist/documents/GameSystem";
import gql from "graphql-tag";
import {Db, MongoClient} from "mongodb";
import { connect } from "mongoose";
import {CharacterResolver} from "../server/resolvers/CharacterResolver";
import { client } from "../utilities/graphql/apiClient";

test("two plus two is four", () => {
  expect(2 + 2).toBe(4)
});

describe("Mongo Test", () => {

  it('should print nothing', async () => {
    const query = gql`
      query {
        gameSystems {
          _id,
          name,
          alias
        }
      }`;

    const { data } = await client.query({query: query});
    console.log(data)
    expect(1).toBe(1)
  });
});
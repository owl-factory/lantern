import Page from "../../components/design/Page";
import { NextPageContext } from "next";
import gql from "graphql-tag";
import { client } from "../../utilities/graphql/apiClient";
import { GameSystem } from "@reroll/model/dist/documents/GameSystem";

interface GameSystemSearchProps {
  gameSystem: GameSystem;
}

export default function GameSystemSearch({gameSystem}: GameSystemSearchProps): JSX.Element {
  return (
    <Page>
      <h1>{gameSystem.name}</h1>
    </Page>
  );
}

GameSystemSearch.getInitialProps = async (ctx: NextPageContext) => {
  const alias = ctx.query.gameSystemAlias;
  const query = gql`
  query {
    gameSystem (_id: "${alias}") {
      _id,
      name,
      alias
    }
  }`;

  const { data } = await client.query({query: query});
  
  return {
    gameSystem: data.gameSystem
  };
}
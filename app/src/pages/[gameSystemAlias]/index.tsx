import Page from "../../components/design/Page";
import { NextPageContext } from "next";
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
 
  return {
    gameSystem: {},
  };
};

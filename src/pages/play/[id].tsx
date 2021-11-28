import { Page } from "components/design";
import { Button } from "components/style";
import { CampaignManager } from "controllers/data/campaign";
import { SceneDataController, SceneManager } from "controllers/data/scene";
import { GameController } from "controllers/multiplayer/game";
import { SceneController } from "controllers/scenes/scenes";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import React from "react";
import { SceneDocument } from "types/documents";
import { rest } from "utilities/request";

const SceneList = observer(() => {
  const [ scenes, setScenes ] = React.useState<Partial<SceneDocument>[]>([]);

  React.useEffect(() => {
    const newScenes = SceneController.allScenes;
    if (newScenes === undefined) { return; }

    setScenes(newScenes);

  }, [SceneController.allScenes]);

  const sceneJSX: JSX.Element[] = [];
  scenes.forEach((scene: Partial<SceneDocument>) => {
    sceneJSX.push(<span key={scene.ref}>{scene.name}<br/></span>);
  });

  return <>{sceneJSX}</>
});

export function PlayPage(props: any): JSX.Element {
  React.useEffect(() => {
    CampaignManager.load();
    if (props.campaign) { CampaignManager.set(props.campaign); }
    GameController.loadCampaign(props.campaign.ref)
  }, [])

  return (
    <Page>
      Play Page<br/>
      Current Game: {GameController.campaign?.name}<br/>
      Current Ruleset: {GameController.ruleset?.name}<br/>
      Current Scene: {SceneController.scene?.name || "None"}<br/>
      <Button onClick={() => SceneController.new()}>Create Scene</Button><br/>
      Scenes: <SceneList/>
    </Page>
  );
}

PlayPage.getInitialProps = async (ctx: NextPageContext) => {
  const game = await rest.get<any>(`/api/campaigns/${ctx.query.id}`);
  const result = { 
    campaign: game.data.campaign
  }

  return result;
}

export default observer(PlayPage);


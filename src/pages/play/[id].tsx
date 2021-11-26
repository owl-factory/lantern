import { Page } from "components/design";
import { Button } from "components/style";
import { CampaignManager } from "controllers/data/campaign";
import { SceneDataController, SceneManager } from "controllers/data/scene";
import { GameController } from "controllers/multiplayer/game";
import { SceneController } from "controllers/scenes/scenes";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import React from "react";
import { Ref64 } from "types";
import { SceneDocument } from "types/documents";
import { getUniques } from "utilities/arrays";
import { rest } from "utilities/request";

function SceneList() {
  const [ scenes, setScenes ] = React.useState<SceneDocument[]>([]);

  React.useEffect(() => {
    // SceneManager.load();
    if (!GameController.campaign || !GameController.campaign.scenes) { return; }
    const sceneRefs: Ref64[] = getUniques(GameController.campaign.scenes, "ref");
    console.log(sceneRefs);
    SceneDataController.readMissing(sceneRefs);
  }, []);


  GameController.campaign?.scenes.forEach((scene: {ref: Ref64}) => {
  });

  return <>Nothing</>
}

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


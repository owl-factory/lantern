import React from "react";

import { observer } from "mobx-react-lite";
import { Page } from "components/design";
import { SceneController } from "controllers/scenes/scenes";
import { CampaignDocument, SceneDocument } from "types/documents";
import { CampaignCache } from "controllers/cache/CampaignCache";
import { SceneCache } from "controllers/cache/SceneCache";

const CampaignSelection = observer(() => {
  const [ campaigns, setCampaigns ] = React.useState<Partial<CampaignDocument>[]>([]);

  React.useEffect(() => {
    setCampaigns(CampaignCache.getPage());
  }, [CampaignCache]);

  const campaignElements: JSX.Element[] = [];
  campaigns.forEach((campaign: Partial<CampaignDocument>) => {
    campaignElements.push(
      <a href="#" onClick={() => SceneController.setCampaign(campaign.ref as string)}>{campaign.name}</a>
    );
  });
  return (
    <div>
      {campaignElements}
    </div>
  );
});

const SceneSelection = observer(() => {
  const [ scenes, setScenes ] = React.useState<Partial<SceneDocument>[]>([]);

  React.useEffect(() => {
    setScenes(SceneCache.getPage());
  });

  const sceneElements: JSX.Element[] = [];
  SceneCache.getPage().forEach((scene: Partial<SceneDocument>) => {
    sceneElements.push(<a href="#" onClick={() => SceneController.setCampaign(scene.ref as string)}>{scene.name}</a>);
  });
  return (
    <div>
      {scenes}
      <a href="#" onClick={() => SceneController.newScene()}>Create Scene</a>
    </div>
  );
});

const SceneBreadcrumbs = observer(() => {
  if (!SceneController.campaignID) {
    return <div>All Scenes</div>;
  } else if (SceneController.campaignID && !SceneController.sceneID) {
    return <div><a onClick={SceneController.reset}>{SceneController.campaign?.name}</a> &gt; Select Scene</div>;
  } else {
    return (
      <div>
        <a onClick={SceneController.reset}>{SceneController.campaign?.name}</a> &gt;
        <a onClick={SceneController.resetScene}>{SceneController.scene?.name}</a>
      </div>
    );
  }
});

function Scenes() {
  return (
    <Page>
      <SceneBreadcrumbs/>
      { !SceneController.campaignID && !SceneController.sceneID ? <CampaignSelection/> : null }
      { SceneController.campaignID && !SceneController.sceneID ? <SceneSelection/> : null }
    </Page>
  );
}

export default observer(Scenes);

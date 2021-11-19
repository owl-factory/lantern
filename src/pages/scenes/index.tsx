import React from "react";

import { observer } from "mobx-react-lite";
import { Page } from "components/design";
import { SceneController } from "controllers/scenes/scenes";
import { CampaignManager } from "controllers/data/campaign";
import { CampaignDocument, SceneDocument } from "types/documents";
import { SceneManager } from "controllers/data/scene";

const CampaignSelection = observer(() => {
  const campaigns: JSX.Element[] = [];
  CampaignManager.getPage().forEach((campaign: CampaignDocument) => {
    campaigns.push(
      <a href="#" onClick={() => SceneController.setCampaign(campaign.id)}>{campaign.name}</a>
    );
  });
  return (
    <div>
      {campaigns}
    </div>
  );
});

const SceneSelection = observer(() => {
  const scenes: JSX.Element[] = [];
  SceneManager.getPage().forEach((scene: SceneDocument) => {
    scenes.push(<a href="#" onClick={() => SceneController.setCampaign(scene.id)}>{scene.name}</a>);
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
  React.useEffect(() => {
    CampaignManager.load();
    SceneManager.load();
  }, []);
  return (
    <Page>
      <SceneBreadcrumbs/>
      { !SceneController.campaignID && !SceneController.sceneID ? <CampaignSelection/> : null }
      { SceneController.campaignID && !SceneController.sceneID ? <SceneSelection/> : null }
    </Page>
  );
}

export default observer(Scenes);

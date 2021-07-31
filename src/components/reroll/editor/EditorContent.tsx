import { EditorController, EditorState } from "client/editor/EditorController";
import { Page } from "components/design";
import React from "react";
import { EditorNav } from "./EditorNav";
import { ListAllCampaigns } from "../campaigns/ListAllCampaigns";


function EditorSwitch({ controller }: any) {
  switch (controller.getState()) {
    case EditorState.ViewAllCampaigns:
      return <ListAllCampaigns controller={controller.getCampaignController()} />;
    default:
      return <>Invalid State</>;
  }
}

export default function EditorContent(): JSX.Element {
  const [ controller ] = React.useState(new EditorController());

  return (
    <Page fluid={true}>
      <EditorNav controller={controller} />
      <EditorSwitch controller={controller} />
    </Page>
  )
}
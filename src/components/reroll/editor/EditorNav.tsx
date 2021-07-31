import { EditorState } from "client/editor/EditorController";
import React from "react";

function NavLink({ name, onClick }: any) {
  return <a href="#" onClick={onClick}>{name}</a>
}

export function EditorNav({ controller }: any) {
  const nav: JSX.Element[] = [];

  function goHome() {
    controller.setState(EditorState.ViewAllCampaigns);
  }

  switch(controller.getState()) {
    case EditorState.ViewAllCampaigns:
      nav.push(<NavLink key="home" name="Home" onClick={goHome}/>)
      nav.push(<NavLink key="allCampaigns" name="All Campaigns"/>)
  }
  return (
    <>
      {nav}
    </>
  )
}
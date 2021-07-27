import React from "react";
import { GridForm } from "./forms/grid";
import { SceneNameForm } from "./forms/SceneNameForm";

export function SceneSettings({ controller }: any): JSX.Element {
  return (
    <div>
      <SceneNameForm controller={controller}/><hr/>
      <GridForm controller={controller}/>
    </div>
  )
}

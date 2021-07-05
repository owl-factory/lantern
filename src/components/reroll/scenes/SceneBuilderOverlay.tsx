import { SceneModeReadable as SCENE_MODE_READABLE, SceneMode, GridType } from "client/scenes/SceneController";
import { Button } from "components/style";
import { observer } from "mobx-react-lite";
import React from "react";
import { GridSizeForm } from "./forms/size";

/**
 * Renders a wrapper that surrounds a scene, applying UI for interaction with the Scene
 */
export const SceneBuilderOverlay = observer(({ children, sceneController }: any): JSX.Element => {
  function addSprite() {
    sceneController.createSprite(
      "http://192.168.0.195:3000/dev/images/sprites/waals_brodnen_death_sprite.png",
      125,
      125
    );
  }

  return (
    <div>
      <div>
        <Button onClick={() => sceneController.setMode(SceneMode.Select) }>Select</Button>
        <Button onClick={() => sceneController.setMode(SceneMode.Pan) }>Pan</Button>
        <br/>
        Current mode: {SCENE_MODE_READABLE[sceneController.mode]}
      </div>
      <div>
        <Button className="sm" onClick={addSprite}>Add Image</Button>
      </div>
      {children}
      <GridSizeForm sceneController={sceneController}/>
    </div>
  );
});

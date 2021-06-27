import { Button } from "components/style";
import React from "react";

export function SceneBuilderOverlay({ children, sceneController }: any): JSX.Element {
  function addSprite() {
    sceneController.createSprite(
      "http://192.168.0.195:3000/images/sprites/waals_brodnen_death_sprite.png",
      125,
      125
    );
  }

  return (
    <div>
      <div>
        <Button className="sm" onClick={addSprite}>Add Image</Button>
      </div>
      {children}
    </div>
  );
}

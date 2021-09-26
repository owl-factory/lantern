import { ImageManager } from "client/data";
import { SceneController } from "client/scenes/SceneController";
import { observer } from "mobx-react-lite";
import { Application } from "pixi.js";
import React from "react";
import { SceneBuilderOverlay } from "../SceneBuilderOverlay";
import { SceneRenderer } from "../SceneRenderer";

const app = new Application({
  width: 500,
  height: 500,
  backgroundColor: 0xAAAAAA,
  antialias: true,
});

/**
 * The page for rendering a standalone scene builder
 */
export const SceneBuilder = observer(() => {
  const [ sceneController ] = React.useState(new SceneController(app));

  React.useEffect(() => {
    ImageManager.load();
  }, []);

  return (
    <div>
      <SceneBuilderOverlay sceneController={sceneController}>
        <SceneRenderer sceneController={sceneController}/>
      </SceneBuilderOverlay>
    </div>
  );
});

export default SceneBuilder;

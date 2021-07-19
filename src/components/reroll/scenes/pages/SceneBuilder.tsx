import { ImageController } from "client/library";
import { SceneController } from "client/scenes/SceneController2";
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
  const [ imageController ] = React.useState(new ImageController());

  React.useEffect(() => {
    imageController.fetchImages();
  }, []);

  return (
    <div>
      <SceneBuilderOverlay imageController={imageController} sceneController={sceneController}>
        <SceneRenderer sceneController={sceneController}/>
      </SceneBuilderOverlay>
    </div>
  );
});

export default SceneBuilder;

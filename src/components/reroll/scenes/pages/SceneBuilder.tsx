import { ImageManager } from "controllers/data/image";
import { observer } from "mobx-react-lite";
import { Application } from "pixi.js";
import React from "react";
import { PixiController } from "controllers/scenes/pixi";
import { SceneOverlay } from "../SceneOverlay";
import { MapController } from "controllers/scenes/map";

const app = new Application({
  width: window.innerWidth,
  height: window.innerHeight - 62,
  backgroundColor: 0xAAAAAA,
  antialias: true,
});

function allowDrop(event: any) {
  event.preventDefault();
}

function drop(event: any) {
  MapController.drop(event);
}

function SceneRenderer(): JSX.Element {
  const ref = React.useRef(null);

  React.useEffect(() => {
    PixiController.setApp(app);
    if (!ref || !ref.current) { return; }
    (ref.current as any).appendChild(app.view);
    app.start();

    return () => {
      app.stop();
    };
  }, []);

  return <div onDragOver={allowDrop} onDrop={drop} ref={ref} />;
}

/**
 * The page for rendering a standalone scene builder
 */
export const SceneBuilder = observer(() => {

  React.useEffect(() => {
    ImageManager.load();
  }, []);

  return (
    <div>
      <SceneOverlay>
        <SceneRenderer />
      </SceneOverlay>
      {/* <SceneBuilderOverlay sceneController={sceneController}>
        <SceneRenderer sceneController={sceneController}/>
        <
      </SceneBuilderOverlay> */}
    </div>
  );
});

export default SceneBuilder;

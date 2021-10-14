import { ImageManager } from "controllers/data/image";
import { observer } from "mobx-react-lite";
import { Application } from "pixi.js";
import React from "react";
import { PixiController } from "controllers/scenes/pixi";

const app = new Application({
  width: window.innerWidth,
  height: window.innerHeight - 62,
  backgroundColor: 0xAAAAAA,
  antialias: true,
});

function SceneRenderer2(): JSX.Element {
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

  return <div ref={ref} />;
}

/**
 * The page for rendering a standalone scene builder
 */
export const SceneBuilder = observer(() => {
  // const [ sceneController ] = React.useState(new SceneController(app));

  React.useEffect(() => {
    ImageManager.load();
  }, []);

  return (
    <div>
      <SceneRenderer2 />
      {/* <SceneBuilderOverlay sceneController={sceneController}>
        <SceneRenderer sceneController={sceneController}/>
        <
      </SceneBuilderOverlay> */}
    </div>
  );
});

export default SceneBuilder;

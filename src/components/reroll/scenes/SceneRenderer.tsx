import { SceneController } from "controllers/maps/SceneController";
import React from "react";

interface SceneRendererProps {
  sceneController: SceneController;
}

/**
 * Renders the scene into a div in a React-friendly way
 * @param sceneController The controller for the current scene
 */
export function SceneRenderer({ sceneController }: SceneRendererProps): JSX.Element {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const app = sceneController.getApp();

    if (!ref || !ref.current) { return; }
    (ref.current as any).appendChild(app.view);
    app.start();

    return () => {
      app.stop();
    };
  }, [sceneController]);

  return <div ref={ref} />;
}

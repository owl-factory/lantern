import React from "react";

export function SceneRenderer({ sceneController }: any): JSX.Element {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const app = sceneController.getApp();
    
    if (!ref || !ref.current) { return; }
    (ref.current as any).appendChild(app.view);
    app.start();
    
    return () => {
      app.stop();
    };
  }, []);

  return <div ref={ref} />;
}

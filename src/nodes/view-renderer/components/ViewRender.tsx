import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { ViewRenderer } from "../controllers/ViewRenderer";
import { RenderSources } from "../types/render";

interface ViewRenderProps {
  viewID?: string;
  sources?: RenderSources;
}

/**
 * The response when no view is selected or is otherwise unable to render anything
 */
function NullView() {
  return (<Box className={`view-render-wrapper`}></Box>);
}


/**
 * Renders a View
 */
export const ViewRender = observer((props: ViewRenderProps) => {
  // The ID of the render used for this view
  const [renderID, setRenderID] = React.useState("");

  React.useEffect(() => {
    if (!props.viewID || !props.sources) { return;}

    // If the view isn't found, set an empty render and exit
    const view = ViewRenderer.views[props.viewID];
    if (!view) {
      setRenderID("");
      return;
    }

    setRenderID(ViewRenderer.startRender(props.viewID, props.sources));

    // Runs after this effect ends, letting us clean up the renders
    const previousID = props.viewID;
    return () => {
      ViewRenderer.endRender(previousID);
    };
  }, [props.viewID]);

  // Handles the case where we can't render anything
  if (renderID === "") {
    return <NullView/>;
  }

  return (
    <Box className={`view-render-wrapper view-render-${renderID}`}>
      View Render
    </Box>
  );
});

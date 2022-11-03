import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { ViewRenderer } from "../controllers/ViewRenderer";
import { RenderSources } from "../types/render";
import { ViewChildren } from "./elements/utility";

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
  const view = ViewRenderer.views[props.viewID || ""];


  React.useEffect(() => {
    if (!props.viewID || !props.sources) { return; }

    // If the view isn't found, set an empty render and exit
    if (!view) {
      setRenderID("");
      return;
    }
    const newRenderID = ViewRenderer.startRender(props.viewID, props.sources);
    setRenderID(newRenderID);

    // Runs after this effect ends, letting us clean up the renders
    const previousID = props.viewID;
    return () => {
      ViewRenderer.endRender(previousID);
    };
  }, [props.viewID, view]);

  // Handles the case where we can't render anything
  if (renderID === "" || view === undefined) {
    return <NullView/>;
  }

  return (
    <Box className={`view-render-wrapper view-render-${props.viewID}`}>
      <ViewChildren renderID={renderID} elements={view.layout || []} properties={ { $prefix: props.viewID } }/>
    </Box>
  );
});

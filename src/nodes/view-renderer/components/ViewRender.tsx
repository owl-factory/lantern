import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { ViewRenderer } from "../controllers/ViewRenderer";

// Describes the different data sources for the View
interface Sources {
  dynamic?: {
    actorID?: string;
    campaignID?: string;
  },
  static: {
    rulesetID?: string;
    contentID?: string;
  }
}

interface ViewRenderProps {
  id?: string;
  sources?: Sources;
}

export const ViewRender = observer((props: ViewRenderProps) => {
  let view;
  React.useEffect(() => {
    if (!props.id) {
      view = undefined;
      return;
    }
    view = ViewRenderer.views[props.id];

    ViewRenderer.startRender(props.id);
    const previousID = props.id;
    return () => {
      ViewRenderer.endRender(previousID);
    };
  }, [props.id]);
  return (
    <Box className={`view-render-wrapper view-render-${props.id}`}>
      View Render
    </Box>
  );
});

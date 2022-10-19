import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { ViewRenderer } from "../controllers/ViewRenderer";

interface ViewWarningsProps {
  id?: string;
}

/**
 * Renders a list of all warnings for a given View
 * @param id The ID of the View to fetch warnings from
 */
export const ViewWarnings = observer((props: ViewWarningsProps) => {
  let warnings: any = [];

  // Ensures that the warnings update correctly when the ID changes
  React.useEffect(() => {
    if (!props.id) {
      warnings = [];
      return;
    }
    warnings = ViewRenderer.views[props.id].warnings || [];
  }, [props.id]);

  if (!props.id) { return <></>; }

  const warningElements: JSX.Element[] = [];

  for (const warning of warnings) {
    warningElements.push(
      <Alert status="warning">
        <AlertIcon/>
        <AlertTitle>{ warning.title }</AlertTitle>
        <AlertDescription>{ warning.description }</AlertDescription>
      </Alert>
    );
  }
  return (
    <Box>
      {warningElements}
    </Box>
  );
});

import Page from "components/design/Page";
import { ActorSheet } from "components/sheets/ActorSheet";
import { ActorSheetData } from "controllers/data/ActorSheetData";
import React from "react";

/**
 * Renders a testing page for rendering an actor sheet
 */
export default function ActorLayoutsTest() {
  // Grabs placeholder XML from the server
  React.useEffect(() => {
    fetch("/dev/mockup.xml").then(async (result: Response) => {
      ActorSheetData.loadSheet("test", await result.text());

    });
  }, []);

  return (
    <Page>
      <ActorSheet id="test"/>
    </Page>
  );
}

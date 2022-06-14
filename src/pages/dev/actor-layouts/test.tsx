import Page from "components/design/Page";
import { ActorSheet } from "components/sheets/ActorSheet";
import React from "react";

/**
 * Renders a testing page for rendering an actor sheet
 */
export default function ActorLayoutsTest() {
  // Grabs placeholder XML from the server
  const [ xml, setXML ] = React.useState("");
  React.useEffect(() => {
    fetch("/dev/mockup.xml").then(async (result: Response) => {setXML(await result.text());});
  }, []);

  return (
    <Page>
      <ActorSheet xml={xml}/>
    </Page>
  );
}

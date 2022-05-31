import Page from "components/design/Page";
import { ActorSheet } from "components/sheets/ActorSheet";
import React from "react";

export default function ActorLayoutsTest() {
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

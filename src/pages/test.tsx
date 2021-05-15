import { Page } from "components";
import React from "react";
import { CampaignModel } from "types";
import { isClient } from "utilities";

export default function Test() {
  React.useEffect(() => {
    console.log(typeof process)
    test();

  }, [])

  async function test() {
    const result = await CampaignModel.findByID("295957071440904710");
    console.log(result);
  }

 if (isClient) {
   console.log("hop")
 }

  return (
    <Page>
      Test
      <button onClick={() => {console.log(typeof process);}}>Test</button>
    </Page>
  );
}

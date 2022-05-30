import { rest } from "@owl-factory/https/rest";
import Page from "components/design/Page";
import { Layout } from "controllers/layout/Layout";
import React from "react";

export default function ActorLayoutsTest() {
  let res = "";
  React.useEffect(() => {
    fetch("/dev/mockup.xml").then(async (result: Response) => {res = await result.text(); console.log(res)});
  }, []);

  return (
    <Page>
      <Layout/>
    </Page>
  );
}
import { isServer } from "@owl-factory/utilities/client";
import { Page } from "components/design";
import React from "react";

export default function ServerSidePropsTest(props: any) {
  console.log("props", props)
  return (
    <Page>Hi</Page>
  );
}

export async function getServerSideProps(context: any) {
  console.log("Is Server", isServer);
  console.log(JSON.parse(context.req.cookies.session))

  return {
    props: {}
  }
}

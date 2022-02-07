import { isServer } from "@owl-factory/utilities/client";
import { Page } from "components/design";
import React from "react";

export default function ServerSidePropsTest(props: any) {
  return (
    <Page>Hi</Page>
  );
}

export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}

import React from "react";
import Page from "../../../components/design/Page";

export default function GameSystemSearch(props: any) {
  console.log(props)
  return (
    <Page>
      Bloo
      {props.test || "No"}
    </Page>
  );
}

GameSystemSearch.getInitialProps = () => {
  return { test: "test" }
}
import { ExamplePromiseWorker } from "@owl-factory/web-worker/examples/ExamplePromiseWorker";
import { Page } from "components/design";
import React from "react";

// Renders a PromiseWebWorker for testing purposes
export default function PromiseWorker() {
  return (
    <Page>
      <ExamplePromiseWorker/>
    </Page>
  );
}

import { Page } from "components/design";
import React from "react";
import { ExampleWorker } from "nodes/web-worker/examples/ExampleWorker";

/**
 * A test page for demonstrating that the web worker code works
 */
export default function WorkerTest() {

  return (
    <Page>
      <ExampleWorker/>
    </Page>
  );
}

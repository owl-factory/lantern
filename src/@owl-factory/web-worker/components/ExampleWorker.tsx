import React from "react";
import { newWebWorker } from "../utilities";
import ExampleSandboxWorker from "../workers/sandbox-example.worker";

export function ExampleWorker() {
  // State is required for handling onComponentLoad
  const [ worker, setWorker ] = React.useState<Worker | null>(null);

  /**
   * Handles the the onmessage event posted by the web worker
   * @param msg The message posted by the worker
   */
  function onMessage(msg: any) {
    if (!msg) { return; }
    console.log("Message from worker:", msg.data);
  }

  React.useEffect(() => {
    const createdWorker = newWebWorker(ExampleSandboxWorker);

    // Prevents issues if this is run serverside
    if (createdWorker === null) { return; }

    createdWorker.onmessage = onMessage;
    setWorker(createdWorker);

    // Termination is required after the consuming component unmounts
    return ( () => worker?.terminate() );
  }, []);

  /**
   * Posts data to the worker
   */
  function postMessage() {
    if (!worker) { return; }
    worker.postMessage({});
  }

  return (
    <button onClick={postMessage}>Click</button>
  );
}

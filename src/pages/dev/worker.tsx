import { Page } from "components/design";
import React from "react";
import ExampleWorker from "@owl-factory/web-worker/example.worker";
import { newSandboxWorker, newWorker } from "@owl-factory/web-worker/builder";
import { Button } from "@owl-factory/components/button";

function fib(message: any) {
  const num = message.data;
  let num1 = 0;
  let num2 = 1;
  let sum = 0;

  for (let i = 2; i < num; i++) {
    sum = num1 + num2;
    num1 = num2;
    num2 = sum;
  }

  const result = num ? num2 : num1;
  postMessage(result);
}

export default function WorkerTest() {
  const [ worker, setWorker ] = React.useState<Worker | null>(null);

  function onMessage(msg: any) {
    if (!msg) { return; }
    console.log("Message from worker", msg.data);
  }

  React.useEffect(() => {
    // const tempWorker = newWorker(ExampleWorker);
    const tempWorker = newSandboxWorker({ onmessage: fib });
    if (tempWorker === null) { return; }
    tempWorker.onmessage = onMessage;
    setWorker(tempWorker);

    return ( () => worker?.terminate() );
  }, []);

  function post(num: number) {
    if (!worker) { return; }
    worker.postMessage(num);
  }

  return (
    <Page>
      <Button onClick={() => post(10)}>Click</Button>
    </Page>
  );
}

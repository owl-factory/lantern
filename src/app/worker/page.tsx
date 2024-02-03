"use client";

import { Button } from "components/ui/Button";
import { WebWorker, WorkerEnvironment } from "features/webWorker";
import { useEffect } from "react";
import { isServer } from "utils/environment";

export function WorkerPage() {
  const worker = new WebWorker<string, undefined, string>(
    WorkerEnvironment.Sandbox,
    () => {
      console.log("Hello world!");
      return "success!";
    },
    5000
  );

  useEffect(() => {
    if (isServer) return undefined;
    if (!worker.ready) worker.attemptReload();
  }, []);

  async function post() {
    if (!worker) return;
    const promise = worker.post("boop", undefined);
    const res = await promise;
    console.log("THE RES", res);
  }

  return (
    <>
      <h1>Testing stuff!</h1>
      <Button onClick={() => post()}>Worker!</Button>
    </>
  );
}

export default WorkerPage;

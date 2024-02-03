"use client";

import { Button } from "components/ui/Button";
import { WebWorker, WorkerEnvironment } from "features/webWorker";
import { WorkerMessage } from "features/webWorker/types/worker";
import { useEffect } from "react";
import { isServer } from "utils/environment";

export function WorkerPage() {
  const worker = new WebWorker<string, undefined, string>(
    WorkerEnvironment.Sandbox,
    (message: WorkerMessage<string, undefined>) => {
      console.log("Hello world!");
      return { id: message.id, ok: true, data: "success!" };
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

"use client";

import { Button } from "components/ui/Button";
import { useEffect } from "react";
import { isServer } from "utils/environment";
import { WebWorker } from "utils/webWorker/controller";
import { test2 } from "utils/webWorker/worker";

export function WorkerPage() {
  const worker = new WebWorker(test2, 5000);

  useEffect(() => {
    if (isServer) return undefined;
    if (!worker.ready) worker.attemptReload();
  }, []);

  async function post() {
    if (!worker) return;
    const promise = worker.post("boop", "haha");
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

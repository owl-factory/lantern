"use client";

import { Button } from "components/ui/Button";
import { WebWorker } from "features/webWorker";
import { test2 } from "features/webWorker/utils/scripts/worker";
import { useEffect } from "react";
import { isServer } from "utils/environment";

export function WorkerPage() {
  const worker = new WebWorker<void, undefined, string>(test2, 5000);

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

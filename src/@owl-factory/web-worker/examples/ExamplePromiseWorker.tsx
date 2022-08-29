import React from "react";
import { PromiseWebWorker } from "../controllers/PromiseWebWorker";
import PromiseExampleWorker from "../workers/promise-example.worker";

// An example implementation of the promise web worker
class PromiseWorkerImpl extends PromiseWebWorker {
  // Extremely hacky way of genering a 'unique' id. Do not use in production
  protected generateUniqueID(_args?: Record<string, unknown> | undefined): string {
    const id = Math.floor((Math.random() * 10000));
    return id.toString();
  }

  // Publicly accessible post function
  public calc(value: number): Promise<number> {
    return this.post({ num: value }) as Promise<number>;
  }
}

const promiseWorker = new PromiseWorkerImpl(PromiseExampleWorker);

/**
 * Renders an example of a Promise-based web worker for testing purposes
 */
export function ExamplePromiseWorker() {
  const [value, setValue] = React.useState(0);
  const [ fib, setFib ] = React.useState("");

  async function onClick() {
    const result = await promiseWorker.calc(value);
    setFib(result.toString());
  }

  return (
    <>
      <input
        type="number"
        value={value}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setValue(parseInt(ev.target.value))}
      />
      <button onClick={onClick}>Submit</button>

      <br/><br/>
      Fibbonacci: {fib}
    </>
  );
}

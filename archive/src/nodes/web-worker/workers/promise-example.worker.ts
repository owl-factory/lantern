import { PromiseWorkerResponse } from "../types/promiseWorker";

/**
 * An example of code that can be used within a web worker. The self.onmessage function is required
 */
export default () => {
  /**
   * Calculates the nth number in the fibbonacci sequence
   */
  self.onmessage = (message) => {
    const num = message.data.num;
    let num1 = 0;
    let num2 = 1;
    let sum = 0;

    for (let i = 2; i <= num; i++) {
      sum = num1 + num2;
      num1 = num2;
      num2 = sum;
    }

    const fibNum = num ? num2 : num1;
    const result: PromiseWorkerResponse<number> = {
      success: true,
      message: "",
      promiseID: message.data.promiseID,
      values: fibNum,
    };
    postMessage(result);
  };
};

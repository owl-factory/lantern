/**
 * Calculates the nth number in the fibbonacci sequence
 */
export default () => {
  self.onmessage = (message) => {
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
  };
};

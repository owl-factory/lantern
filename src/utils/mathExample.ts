/**
 * An example sum function for example jest testing.
 * @param numbers - set of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters | rest parameters} accepted
 * as an array of numbers to be summed together.
 * @returns sum of all numbers provided as parameters.
 */
export function sum(...numbers: number[]) {
  let total = 0;
  for (const number of numbers) {
    total += number;
  }
  return total;
}

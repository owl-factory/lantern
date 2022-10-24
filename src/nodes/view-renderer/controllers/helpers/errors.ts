import { AlertMessage } from "@owl-factory/alerts";

/**
 * Ensures that an error message is packaged into the correct format before sending it off.
 * @param e The error recieved from a throw. This should be an AlertMessage type, but is not gauranteed
 * @param defaultError The default message to use in the event that the given error does not match
 * @param onError A callback function to use to pass the error along to, if any
 */
export function handleError(e: unknown, defaultError: AlertMessage, onError?: (error: AlertMessage) => void): void {
  // If no options are specified, throw as normal
  if (!onError) { throw e; }

  // Non-standard errors
  if (typeof e === "string") { onError({ title: defaultError.title, description: e}); }
  else if (e === null || (typeof e === "object" && !("description" in e))) {
    onError(defaultError);
    console.error(e);
  } else {
    // Standard error
    onError(e as AlertMessage);
  }
}

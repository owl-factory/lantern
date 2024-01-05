/**
 * Regular expression to test if a given string is in a valid email address format.
 */
export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Regular expression to test if a given string is in a valid Session ID format:
 * 40 characters that can only be a-Z, A-Z or 0-9.
 */
export const sessionIdRegex = /^[a-zA-Z0-9]{40}$/;

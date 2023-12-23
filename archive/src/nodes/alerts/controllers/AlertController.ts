import { UseToastOptions } from "@chakra-ui/react";

// The default time (in seconds) that an alert will live
const DEFAULT_TTL = 5 * 1000;

class $AlertController {
  public useToast: any;

  /**
   * Adds a success message
   * @param message The alert message
   * @param ttl Time to live. The time in seconds before commands are automatically dismissed
   */
  public success(defaultOptions?: UseToastOptions) { this.add({ ...defaultOptions, status: "success"}); }

  /**
   * Adds a information message
   * @param message The alert message
   * @param ttl Time to live. The time in seconds before commands are automatically dismissed
   */
  public info(defaultOptions?: UseToastOptions) { this.add({ ...defaultOptions, status: "info"}); }

  /**
   * Adds a warning message
   * @param message The alert message
   * @param ttl Time to live. The time in seconds before commands are automatically dismissed
   */
  public warning(defaultOptions?: UseToastOptions) { this.add({ ...defaultOptions, status: "warning"}); }

  /**
   * Adds an error message
   * @param message The alert message
   * @param ttl Time to live. The time in seconds before commands are automatically dismissed
   */
  public error(defaultOptions?: UseToastOptions) { this.add({ ...defaultOptions, status: "error"}); }

  /**
   * Adds a message
   * @param message The message to add
   * @param type The type of alert being added
   * @param ttl Time to live. The time in seconds before commands are automatically dismissed
   */
  public add(defaultOptions?: UseToastOptions) {
    if (!this.useToast) { return; }
    // IsClosable is true by default unless specified
    if (defaultOptions && defaultOptions.isClosable === undefined) { defaultOptions.isClosable = true; }
    if (defaultOptions && defaultOptions.duration === undefined) { defaultOptions.duration = DEFAULT_TTL; }
    this.useToast(defaultOptions);
  }

  /**
   * Clears the whole stack
   */
  public clear() {
    this.useToast.closeAll();
  }
}

export const Alerts = new $AlertController();

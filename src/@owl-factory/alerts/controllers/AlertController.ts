import { action, makeObservable, observable } from "mobx";
import { AlertType } from "../enums/alertType";
import { AlertMessage } from "../types/alertMessage";

// The default time (in seconds) that an alert will live
const DEFAULT_TTL = 5;

class $AlertController {
  public alerts: AlertMessage[] = [];

  constructor() {
    makeObservable(this, {
      alerts: observable,
      add: action,
      success: action,
      clear: action,
      close: action,
      removeByKey: action,
    });
  }

  /**
   * Gets the three newest alerts
   */
  public getTopAlerts() {
    const result: AlertMessage[] = [];
    for(let i = 0; i < 3 && i < this.alerts.length; i ++) {
      result.push(this.alerts[i]);
    }
    return result;
  }

  /**
   * Adds a success message
   * @param message The alert message
   * @param ttl Time to live. The time in seconds before commands are automatically dismissed
   */
  public success(message: string, ttl = DEFAULT_TTL) { this.add(message, AlertType.Success, ttl); }

  /**
   * Adds a information message
   * @param message The alert message
   * @param ttl Time to live. The time in seconds before commands are automatically dismissed
   */
  public info(message: string, ttl = DEFAULT_TTL) { this.add(message, AlertType.Info, ttl); }

  /**
   * Adds a warning message
   * @param message The alert message
   * @param ttl Time to live. The time in seconds before commands are automatically dismissed
   */
  public warning(message: string, ttl = DEFAULT_TTL) { this.add(message, AlertType.Warning, ttl); }

  /**
   * Adds an error message
   * @param message The alert message
   * @param ttl Time to live. The time in seconds before commands are automatically dismissed
   */
  public error(message: string, ttl = DEFAULT_TTL) { this.add(message, AlertType.Error, ttl); }

  /**
   * Adds a message
   * @param message The message to add
   * @param type The type of alert being added
   * @param ttl Time to live. The time in seconds before commands are automatically dismissed
   */
  public add(message: string, type: AlertType, ttl: number) {
    const alert: AlertMessage = { key: Math.random().toString(), message, type };
    this.alerts.splice(0, 0, alert);
    if (ttl > 0) {
      setTimeout(() => this.removeByKey(alert.key), ttl * 1000);
    }
  }

  /**
   * Clears the whole stack
   */
  public clear() {
    this.alerts.splice(0, this.alerts.length);
  }

  /**
   * Removes a single alert from the AlertController stack
   * @param index The index to remove
   */
  public close(index: number) {
    if (!(index >= 0 && index < this.alerts.length)) { return; }
    this.alerts.splice(index, 1);
  }

  /**
   * Returns an alert by its key in the case where the index may not be known
   * @param key The key of the alert to remove
   */
  public removeByKey(key: string) {
    for(let i = 0; i < this.alerts.length; i++) {
      const alert = this.alerts[i];
      if (alert.key === key) {
        this.alerts.splice(i, 1);
        return;
      }
    }
  }
}

export const AlertController = new $AlertController();

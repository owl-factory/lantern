import { action, makeObservable, observable } from "mobx";


export enum AlertType {
  Success,
  Info,
  Warning,
  Error,
}

export interface AlertMessage {
  key: string; // A uuid to provide a reliable way of removing an alert without a specific index
  message: string;
  type: AlertType;

}

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

  public getTopAlerts() {
    const result: AlertMessage[] = [];
    for(let i = 0; i < 3 && i < this.alerts.length; i ++) {
      result.push(this.alerts[i]);
    }
    return result;
  }


  public success(message: string, ttl = DEFAULT_TTL) { this.add(message, AlertType.Success, ttl); }
  public info(message: string, ttl = DEFAULT_TTL) { this.add(message, AlertType.Info, ttl); }
  public warning(message: string, ttl = DEFAULT_TTL) { this.add(message, AlertType.Warning, ttl); }
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

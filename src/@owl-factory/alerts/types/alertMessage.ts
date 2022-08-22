import { AlertType } from "../enums/alertType";

// Describes the content of a message added to the Alert queue
export interface AlertMessage {
  key: string; // A unique ID to provide a reliable way of removing an alert without a specific index
  message: string;
  type: AlertType;
}

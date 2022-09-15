import React from "react";
import { observer } from "mobx-react-lite";
import styles from "../styles/AlertMessages.module.scss";
import { AlertController } from "../controllers/AlertController";
import { AlertMessage } from "../types/alertMessage";
import { Alert } from "@chakra-ui/react";

interface AlertMessageProps {
  alert: AlertMessage;
  index: number;
}

const AlertVariants: string[] = [
  "secondary",
  "info",
  "warning",
  "primary",
];

/**
 * Renders an alert message
 * @param alert The instructions for the message and alert type
 * @param index The index of this alert in the queue
 */
function AlertMessage({ alert, index }: AlertMessageProps) {
  return (
    <Alert variant={AlertVariants[alert.type]}>
      {alert.message}
      <span style={{float: "right"}} onClick={() => AlertController.close(index)}>
        X
      </span>
    </Alert>
  );
}

interface TotalAlertsProps {
  size: number;
}

/**
 * Renders a message displaying the remaining number of alerts
 * @param size The total number of alerts stored in the AlertController
 * @todo Make the threshold configurable
 * @returns A message if more than a specified number of alerts existed
 */
function TotalAlerts({ size }: TotalAlertsProps) {
  if (size <= 3) { return <></>; }
  return (
    <div>
      And {size - 3} more alert{ size > 3 + 1 ? "s" : ""}.&nbsp;
      <a href="#" onClick={() => AlertController.clear()}>Clear?</a>
    </div>
  );
}

/**
 * Renders a list of alert messages
 */
export const AlertMessages = observer(() => {
  const [ alerts, setAlerts ] = React.useState(AlertController.getTopAlerts());
  const alertElements: JSX.Element[] = [];

  React.useEffect(() => {
    setAlerts(AlertController.getTopAlerts());
  }, [AlertController.alerts.length]);

  alerts.forEach((alert: AlertMessage, index: number) => {
    alertElements.push(<AlertMessage key={alert.key} alert={alert} index={index}/>);
  });

  return (
    <>
      <div className={styles.alertContainer}>
        {alertElements}
        <TotalAlerts size={AlertController.alerts.length}/>
      </div>
    </>
  );
});

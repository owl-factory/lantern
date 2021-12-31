import React from "react";
import { observer } from "mobx-react-lite";
import styles from "./AlertMessages.module.scss";
import { Alert, Button } from "react-bootstrap";
import { Form, Formik } from "formik";
import { AlertController, AlertMessage } from "controllers/AlertController";
import { Input } from "./style/forms";

function onSubmit(values: any) {
  AlertController.success(values.message);
}

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

function AlertElement({ alert, index }: AlertMessageProps) {
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

function TotalAlerts({ size }: TotalAlertsProps) {
  if (size <= 3) { return <></>; }
  return (
    <div>
      And {size - 3} more alert{ size > 3 + 1 ? "s" : ""}.&nbsp;
      <a href="#" onClick={() => AlertController.clear()}>Clear?</a>
    </div>
  );
}

export const AlertMessages = observer(() => {
  const [ alerts, setAlerts ] = React.useState(AlertController.getTopAlerts());
  const alertElements: JSX.Element[] = [];

  React.useEffect(() => {
    setAlerts(AlertController.getTopAlerts());
  }, [AlertController.alerts.length]);

  alerts.forEach((alert: AlertMessage, index: number) => {
    alertElements.push(<AlertElement key={alert.key} alert={alert} index={index}/>);
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

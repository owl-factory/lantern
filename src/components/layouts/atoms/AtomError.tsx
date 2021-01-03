import React from "react";
import { Col } from "react-bootstrap";

export function AtomError(props: any) {
  return (
    <Col {...(props.w || {}) } style={{color: "red", fontWeight: "bold"}}>
      {props.errors}
    </Col>
  )
}
import { Col } from "components/style";
import React from "react";

/**
 * Renders error messages within an atom's allocated space to 
 * prevent the cascading collapse
 * @param props.errors The errors to render within the AtomError
 * @param props.w The width of the AtomError to fit within the expected atom
 */
export function AtomError(props: any) {
  return (
    <Col {...(props.w || {}) } style={{color: "red", fontWeight: "bold"}}>
      {props.errors}
    </Col>
  );
}

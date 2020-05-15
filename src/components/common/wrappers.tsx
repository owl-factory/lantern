import React from "react";
import Link from "next/link";
import { Col, Card } from "react-bootstrap";

/**
 * A single tile inside of a row
 * @param props The children to render inside
 */
export function TileWrapper(props: any) {
  return (
    <Col xl={2} lg={3} md={4} sm={6} xs={12}>
      <CardWrapper href={props.href}>
        {props.children}
      </CardWrapper>
    </Col>
  );
}

/**
 * A page-wide tile inside of a row
 * @param props The children to render inside
 */
export function FullWrapper(props: any) {
  return (
    <Col xs={12}>
      <CardWrapper href={props.href}>
        {props.children}
      </CardWrapper>
    </Col>
  );
}

/**
 * An internal card wrapper that places contents within a standard card
 * @param props 
 */
function CardWrapper(props: any) {
  const cardWrapper = (
    <Card>
      <Card.Body>
        {props.children}
      </Card.Body>
    </Card>
  );

  if (props.href !== undefined) {
    return (
      <Link href={props.href} passHref>
        {cardWrapper}
      </Link>
    );
  }

  return cardWrapper;
}

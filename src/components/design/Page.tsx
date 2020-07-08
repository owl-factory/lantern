import React, { ReactNode } from "react";
import { Container } from "react-bootstrap";

interface PageProps {
  children: ReactNode;
}

/**
 * The page component is used to wrap the content of a page to apply uniform
 * styling such as page margins.
 *
 * @param {ReactNode} props.children The child elements nested within this element.
 * These are passed automatically
 */
function Page(props: PageProps) {
  return (
    <Container className="mt-3">
      {props.children}
    </Container>
  );
}

export default Page;

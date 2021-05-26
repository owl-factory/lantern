import React, { ReactNode } from "react";
import { Container } from "react-bootstrap";

interface PageProps {
  children: ReactNode;
  error?: object; // An error to render
}

function parseError(error: any): string {
  if (typeof error === "string") { return error; }
  try {
    return error.requestResult.responseContent.errors[0].cause[0].description;
  } catch {
    return "An unknown error has occured";
  }
}

/**
 * The page component is used to wrap the content of a page to apply uniform
 * styling such as page margins.
 *
 * @param {ReactNode} props.children The child elements nested within this element.
 * These are passed automatically
 */
export function Page(props: PageProps): JSX.Element {
  return (
    <Container className="mt-3">
      { props.error ? <>{parseError(props.error)}</> : <></>}
      {props.children}
    </Container>
  );
}

export default Page;

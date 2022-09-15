import React, { ReactNode } from "react";
import ErrorPage from "next/error";
import { AlertMessages } from "@owl-factory/alerts";
import { Box, Container, Flex } from "@chakra-ui/react";

interface PageProps {
  children: ReactNode;
  error?: any; // An error to render
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

  if (props.error && typeof(props.error) === "number") {
    return <ErrorPage statusCode={props.error} />;
  }

  return (
    <Flex>
      {/* TODO - permanent drawers on either side */}
      <Container maxW="container.xl" paddingTop={5}>
        { props.error ? <>{parseError(props.error)}</> : <></>}
        {props.children}
      </Container>
      <AlertMessages/>
    </Flex>
  );
}

export default Page;

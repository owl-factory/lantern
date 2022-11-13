import React, { ReactNode } from "react";
import ErrorPage from "next/error";
import { Alerts } from "@owl-factory/alerts";
import { Box, Container, Flex, useToast } from "@chakra-ui/react";
import HeaderBar from "./headerBar/HeaderBar";

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
  const toast = useToast();
  React.useEffect(() => {
    Alerts.useToast = toast;
  }, []);

  if (props.error && typeof(props.error) === "number") {
    return <ErrorPage statusCode={props.error} />;
  }

  return (
    <>
      <HeaderBar />
      <Flex>
        {/* TODO - permanent drawers on either side */}
        <Container maxW="container.xl" paddingTop={5}>
          { props.error ? <>{parseError(props.error)}</> : <></>}
          {props.children}
        </Container>
      </Flex>
    </>
  );
}

export default Page;

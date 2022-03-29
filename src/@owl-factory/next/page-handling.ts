import { isServer } from "@owl-factory/utilities/client";
import { useRouter } from "next/router";
import { InitialProps } from "types/client";

/**
 * Handles an event where the API throws an error
 * @param props The props from a page component
 */
export function onApiError(props: InitialProps): void {
  if (isServer) { return; }
  if (props.success) { return; }

  const router = useRouter();
  // router.push(`/500?message=${props.message}`);
}

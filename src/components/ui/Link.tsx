import NextLink from "next/link";
import { forwardRef } from "react";
import { isExternalUrl } from "utils/strings";

type NextLink = typeof NextLink;
type AnchorProps = JSX.IntrinsicElements["a"];

const DEFAULT_CLASSES = "bg-red-500";

/**
 * Renders an HTML <a> tag properly styled for Lantern. Uses `next/link` for local URLs, providing client side navigation.
 * @param props - `next/link` props, which also includes all HTML <a> tag attributes.
 * @param ref - React reference to forward used for DOM interactions.
 */
export const Link: NextLink = forwardRef(function Link(props, ref) {
  const className = `${DEFAULT_CLASSES} ${props.className || ""}`;

  if (props.href && typeof props.href === "string" && isExternalUrl(props.href)) {
    const modProps = { replace: undefined, scroll: undefined, prefetch: undefined, ...props } as AnchorProps;
    return <a target="_blank" rel="nonoopener" {...modProps} className={className} ref={ref} />;
  }
  return <NextLink {...props} className={className} />;
});

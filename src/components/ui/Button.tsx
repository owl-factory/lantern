import { ForwardedRef, forwardRef } from "react";

type ButtonProps = JSX.IntrinsicElements["button"];

const DEFAULT_CLASSES = "bg-red-500";

/**
 * Renders an HTML <button> tag properly styled for Lantern.
 * @param props - Set of attributes ordinarily included with an HTML <button> element.
 * @param ref - React reference to forward used for DOM interactions.
 */
export const Button = forwardRef(function Button(props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  const className = `${DEFAULT_CLASSES} ${props.className || ""}`;

  return <button type="button" {...props} className={className} ref={ref} />;
});

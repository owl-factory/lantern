import { type ForwardedRef, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export type ButtonVariants = VariantProps<typeof button>;
type ButtonProps = JSX.IntrinsicElements["button"] & ButtonVariants;

export const button = tv({
  base: "",
  variants: {
    color: {
      primary: "bg-amber-400",
      secondary: "text-gray-300 border-2 border-gray-600",
      none: "none",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

/**
 * Renders an HTML <button> tag properly styled for Lantern.
 * @param props - Set of attributes ordinarily included with an HTML <button> element.
 * @param ref - React reference to forward used for DOM interactions.
 */
export const Button = forwardRef(function Button(props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  const className = button({ color: props.color, className: props.className });

  return <button type="button" {...props} className={className} ref={ref} />;
});

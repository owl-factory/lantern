import { type ForwardedRef, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export type ButtonVariants = VariantProps<typeof button>;
type ButtonProps = JSX.IntrinsicElements["button"] & ButtonVariants;

/**
 * `tailwind-variants` object definition for the {@link Button} component.
 */
export const button = tv({
  base: "",
  variants: {
    color: {
      primary:
        "bg-amber-400 text-black shadow-sm text-sm font-medium rounded-md hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition py-3 px-4",
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
export const Button = forwardRef(function Button(
  props: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const className = button({ color: props.color, className: props.className });
  const modProps = { ...props, className };
  delete modProps.color;

  return <button type="button" {...modProps} ref={ref} />;
});

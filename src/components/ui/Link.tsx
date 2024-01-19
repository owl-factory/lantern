import { type ButtonVariants, button } from "components/ui/Button";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { ForwardedRef, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { isExternalUrl } from "utils/strings";

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
type LinkVariants = VariantProps<typeof link>;
type LinkProps = AnchorProps & NextLinkProps & LinkVariants & ButtonVariants & { type?: "button" };

/**
 * `tailwind-variants` object definition for the {@link Button} component.
 */
export const link = tv({
  base: "",
  variants: {
    variant: {
      underline:
        "font-medium text-white decoration-2 underline underline-offset-2 hover:text-gray-200 hover:decoration-gray-400",
      plain: "font-medium text-white",
      none: "none",
    },
    inactive: {
      true: "text-gray-400 hover:text-gray-500",
    },
  },
  defaultVariants: {
    variant: "underline",
  },
});

/**
 * Renders an HTML <a> tag properly styled for Lantern. Uses `next/link` for local URLs, providing client side navigation.
 * External links have `target="_blank"` and `rel="nonoopener"` applied to them by default, but this can be overridden.
 * @param props - `next/link` props, which also includes all HTML <a> tag attributes.
 * @param ref - React reference to forward used for DOM interactions.
 */
export const Link = forwardRef(function Link(props: LinkProps, ref: ForwardedRef<HTMLAnchorElement>) {
  let className;
  if (props?.type === "button") {
    className = button({ color: props.color, className: props.className });
  } else {
    className = link({ variant: props.variant, inactive: props.inactive, className: props.className });
  }

  if (props.href && typeof props.href === "string" && isExternalUrl(props.href)) {
    const modProps = { replace: undefined, scroll: undefined, prefetch: undefined, ...props } as AnchorProps;
    return <a target="_blank" rel="nonoopener" {...modProps} className={className} ref={ref} />;
  }

  return <NextLink {...props} className={className} />;
});

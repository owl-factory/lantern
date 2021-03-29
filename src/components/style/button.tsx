interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  type: "button" | "submit" | "reset" | undefined;
}

export function Button(props: ButtonProps): JSX.Element {
  const className = `btn btn-primary ${props.className}`;
  return (
    <button
      className={className}
      type={props.type}
    >
      {props.children}
    </button>
  );
}

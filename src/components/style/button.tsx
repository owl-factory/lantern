interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function Button(props: ButtonProps): JSX.Element {
  const className = `btn btn-primary ${props.className}`;
  const type = props.type || "button";
  return (
    <button
      className={className}
      onClick={props.onClick}
      type={props.type}
    >
      {props.children}
    </button>
  );
}

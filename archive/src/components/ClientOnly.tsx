import React from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  loading?: JSX.Element;
  delegated?: any;
}

export default function ClientOnly({ children, loading, ...delegated }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return loading ? loading : null;
  }

  return <div {...delegated}>{children}</div>;
}

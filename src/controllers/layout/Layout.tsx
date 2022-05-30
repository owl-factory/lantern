import React from "react";

const PARSER = new DOMParser();

export function Layout(props: any) {
  const [ xml, setXML ] = React.useState<Document | null>(null);

  React.useEffect(() => {
    try {
      const parsedXML = PARSER.parseFromString(props.xml, "text/xml");
      setXML(parsedXML);
    } catch (e) {
      setXML(null);
    }
  }, [props.xml]);

  if (xml === null) { return <></>; }

  return (
    <>xml</>
  );
}

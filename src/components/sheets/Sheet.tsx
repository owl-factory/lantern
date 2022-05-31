import { SheetRenderController } from "controllers/layout/SheetController";
import { action, makeObservable, observable } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { SheetTabs } from "./Tabs";

const PARSER = new DOMParser();
const sheetController = new SheetRenderController();

const Sheet = observer((props: any) => {
  const [ xml, setXML ] = React.useState<Document | null>(null);
  const [ tab, setTab ] = React.useState(0);

  React.useEffect(() => {
    try {
      const parsedXML = PARSER.parseFromString(props.xml, "text/xml");
      setXML(parsedXML);
      sheetController.load(parsedXML);
    } catch (e) {
      setXML(null);
    }
  }, [props.xml]);

  if (xml === null) { return <></>; }

  return (
    <div>
      <SheetTabs tab={tab} setTab={setTab} ctrl={sheetController}/>
    </div>
  );
});


export default Sheet;

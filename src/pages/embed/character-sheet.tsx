import { Select } from "@owl-factory/components/form";
import ClientOnly from "components/ClientOnly";
import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { ViewRender } from "nodes/view-renderer";
import React, { ChangeEvent } from "react";

function DemoCharacterList(props: any) {

  const options: JSX.Element[] = [];
  options.push(<option key="empty_option" value="">Demo 5e Character Sheet</option>);

  function onChange(ev: ChangeEvent<HTMLSelectElement>) {
    props.setActiveCharacter(ev.target.value);
  }

  return (
    <select name="actorID" onChange={onChange}>
      {options}
    </select>
  );
}

function DemoCharacterSheet(props: any) {
  return (
    <ViewRender />
  );
}

function EmbedCharacterSheet(props: any) {
  const [ activeCharacter, setActiveCharacter ] = React.useState("");
  
  if (!props.actorSheetID) { return <>No Character Sheet has been set by the developer</>; }


  return (
    <>
      <ClientOnly>
        <DemoCharacterList actorIDs={props.actorIDs} setActiveCharacter={setActiveCharacter}/>
      </ClientOnly>
      <ClientOnly>
        <DemoCharacterSheet activeCharacter={activeCharacter}/>
      </ClientOnly>
    </>
  );
}

export default observer(EmbedCharacterSheet);

export function getServerSideProps() {
  const actorIDs = (process.env.DEMO_CHARACTERS ? process.env.DEMO_CHARACTERS.split(",") : []);
  return {
    props: {
      actorSheetID: process.env.DEMO_CHARACTER_SHEET_ID || "",
      actorIDs,
    },
  };
}

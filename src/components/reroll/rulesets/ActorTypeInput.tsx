import { Button } from "@owl-factory/components/button";
import { getUniques } from "@owl-factory/utilities/arrays";
import React from "react";
import { ActorType } from "types/documents";
import { getNextUntitled } from "utilities/helpers";

interface ActorTypeProps {
  actorTypes: ActorType[];
  setActorTypes: (actorTypes: ActorType[]) => void;
  activeType: string | undefined;
  setActiveType: (activeType: string | undefined) => void;
}

function ActorTypeList(props: ActorTypeProps) {
  const rows: JSX.Element[] = [];

  for (const actorType of props.actorTypes) {
    rows.push(
      <div key={actorType.key}>
        {actorType.name} ({actorType.key})
      </div>
    );
  }

  function add() {
    const actorTypes = [...props.actorTypes];
    const keys = getUniques(actorTypes, "key");
    const untitled = getNextUntitled(keys);
    const newActorType: ActorType = {
      name: "Untitled",
      key: untitled,
      description: "",
      actorSheet: { ref: "" },
    };
    actorTypes.push(newActorType);
    props.setActorTypes(actorTypes);
  }

  function remove() {
    return;
  }

  return (
    <div style={{ borderStyle: "dashed", borderWidth: 1, flexGrow: 1 }}>
      <div>
        <Button onClick={remove}>-</Button>
        <Button onClick={add}>+</Button>
      </div>
      {rows}
    </div>
  );
}

function ActorTypeForm(props: ActorTypeProps) {
  const style = { flexGrow: 1};

  return (
    <div style={style}>
      Form
    </div>
  )
}

interface ActorTypeInputProps {
  actorTypes: ActorType[];
  setActorTypes: (actorTypes: ActorType[]) => void;
}

export function ActorTypeInput(props: ActorTypeInputProps) {
  const [ activeType, setActiveType ] = React.useState<string | undefined>();

  return (
    <div>
      <h2>Actor Types</h2>
      <i>Defines the different types of actors / characters used within a game, such as PCs and NPCs.</i>

      <div style={{ display: "flex" }}>
        <ActorTypeList {...props} activeType={activeType} setActiveType={setActiveType}/>
        <ActorTypeForm {...props} activeType={activeType} setActiveType={setActiveType}/>
      </div>
    </div>
  );
}

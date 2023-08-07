import { Button } from "@chakra-ui/react";
import { Input, Select } from "components/form";
import { getUniques } from "utilities/arrays";
import { Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { ActorType } from "types/documents";
import { getNextUntitled } from "utilities/helpers";
import styles from "./ActorTypeInput.module.scss";

interface ActorTypeProps {
  actorTypes: ActorType[];
  setActorTypes: (actorTypes: ActorType[]) => void;
  activeType: number | undefined;
  setActiveType: (activeType: number | undefined) => void;
}

/**
 * Renders a selectable list of all actor types used for the current ruleset
 * @param actorTypes A list of all actor types for the current ruleset
 * @param setActorTypes A function to update the list of actor types for this current ruleset
 * @param activeType The index of the currently active actor type being edited
 * @param setActiveType A function to update the currently active actor type
 */
function ActorTypeList(props: ActorTypeProps) {
  const rows: JSX.Element[] = [];

  /**
   * Sets the next active type
   * @param index The index of the actor type to select
   */
  function setActiveType(index: number) {
    if (index === props.activeType) { props.setActiveType(undefined); }
    else { props.setActiveType(index); }
  }

  /**
   * Adds a new actor type
   */
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
    props.setActiveType(actorTypes.length - 1);
  }

  /**
   * Removes the currently selected actor type
   */
  function remove() {
    if (props.activeType === undefined) { return; }
    const actorTypes = [...props.actorTypes ];
    actorTypes.splice(props.activeType, 1);
    props.setActorTypes(actorTypes);
    props.setActiveType(undefined);
    return;
  }

  for (let i = 0; i < props.actorTypes.length; i++) {
    const actorType = props.actorTypes[i];
    const className = i === props.activeType ? styles.active : "";
    rows.push(
      <div key={actorType.key} className={className} onClick={() => setActiveType(i)}>
        {actorType.name} ({actorType.key})
      </div>
    );
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

/**
 * Renders a select input for selecting the current type of actor type
 * @param onChange The function to run when the value of the select changes
 */
function ActorTypeSheetSelect(props: { onChange: () => void }) {
  const router = useRouter();

  const options: JSX.Element[] = [];

  return (
    <>
      <label htmlFor="actor_type_sheet">Actor Sheet</label>
      <Select id="actor_type_sheet" name="actorSheet.ref" onChange={props.onChange}>
        <option>-- None --</option>
        <>{options}</>
      </Select>
    </>
  );
}

/**
 * Renders a form for modifying the values of an actor type
 * @param actorTypes A list of all actor types for the current ruleset
 * @param setActorTypes A function to update the list of actor types for this current ruleset
 * @param activeType The index of the currently active actor type being edited
 * @param setActiveType A function to update the currently active actor type
 */
function ActorTypeForm(props: ActorTypeProps) {
  const style = { flexGrow: 1};
  if (props.activeType === undefined) { return <div style={style}></div>; }

  const actorType = props.actorTypes[props.activeType];

  /**
   * Updates the actor type saves in the ruleset
   * @param updatedActorType The new actor type to save
   */
  function onSubmit(updatedActorType: ActorType) {
    if (props.activeType === undefined) { return; }
    const actorTypes = [ ...props.actorTypes ];
    actorTypes[props.activeType] = updatedActorType;
    props.setActorTypes(actorTypes);
  }

  return (
    <div style={style}>
      <Formik
        initialValues={actorType}
        onSubmit={onSubmit}
      >
        {(formikProps: FormikProps<ActorType>) => {
          React.useEffect(() => {
            formikProps.setValues(actorType);
          }, [props.activeType]);
          return (
            <>
              <label htmlFor="actor_type_name">Name</label>
              <Input id="actor_type_name" name="name" type="text" onBlur={formikProps.submitForm}/>
              <label htmlFor="actor_type_key">Key</label>
              <Input id="actor_type_key" name="key" type="text" onBlur={formikProps.submitForm}/>
              <label htmlFor="actor_type_desc">Description</label>
              <Input id="actor_type_desc" name="description" type="text" onBlur={formikProps.submitForm}/>
              <ActorTypeSheetSelect onChange={formikProps.submitForm}/>
            </>
          );
        }}
      </Formik>
    </div>
  );
}

interface ActorTypeInputProps {
  actorTypes: ActorType[];
  setActorTypes: (actorTypes: ActorType[]) => void;
}

/**
 * An input for creating and editing actor types
 * @param actorTypes The list of all actor types held by the current ruleset
 * @param setActorTypes A function to update the actor types
 */
export function ActorTypeInput(props: ActorTypeInputProps) {
  const [ activeType, setActiveType ] = React.useState<number | undefined>();

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

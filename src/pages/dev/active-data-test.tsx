import { gql, useQuery } from "@apollo/client";
import { Button, Select } from "@chakra-ui/react";
import { Alerts } from "nodes/alerts";
import { Page } from "components/design";
import { observer } from "mobx-react-lite";
import { ActiveData } from "nodes/active-data";
import React from "react";

const FETCH_ALL_ACTORS = gql`
  query DEVfetchAllActors {
    actors {
      id, name, fields
    }
  }
`;

/**
 * A page for testing the Active Data controller. Allows for setting which actor will be updated,
 * checking their test field number, and updating it. Manual and automatic saving should be supported.
 */
function ActiveDataTest() {
  const actorsQuery = useQuery(FETCH_ALL_ACTORS);
  const [ actor1, setActor1 ] = React.useState("");
  const [ actor2, setActor2 ] = React.useState("");

  function onClick(id: string) {
    const count = ActiveData.getActor(id, "test") as number || 0;
    ActiveData.setActor(id, "test", count + 1);
    Alerts.success({ title: `${ActiveData.getActor(id, "name")} was updated to ${count + 1}`});
  }

  // Handles error cases
  if (actorsQuery.loading) { return <Page>Loading</Page>; }
  if (actorsQuery.error) { return <Page>Error</Page>; }

  const actorOptions: JSX.Element[] = [];
  for (const actor of actorsQuery.data.actors) {
    actorOptions.push(<option key={actor.id} value={actor.id}>{actor.name}</option>);
  }

  return (
    <Page>
      Actor 1:
      <Select onChange={(ev) => { setActor1(ev.target.value); ActiveData.refreshActor(ev.target.value);}}>
        <option>--Select One--</option>
        {actorOptions}
      </Select><br/>
      Actor 2:
      <Select onChange={(ev) => { setActor2(ev.target.value); ActiveData.refreshActor(ev.target.value);}}>
        <option>--Select One--</option>
        {actorOptions}
      </Select>
      <hr/>
      <Button onClick={() => onClick(actor1)}>Update {ActiveData.getActor(actor1, "name")}</Button>
      <Button onClick={() => onClick(actor2)}>Update {ActiveData.getActor(actor2, "name")}</Button>
      <br/>
      <Button onClick={() => console.log(ActiveData.actorChangeList)}>Check Changes</Button>
      <Button onClick={() => ActiveData.save()}>Save</Button><br/>
      {ActiveData.getActor(actor1, "name")}:&nbsp;
      {ActiveData.getActor(actor1, "test")}<br/>
      {ActiveData.getActor(actor2, "name")}:&nbsp;
      {ActiveData.getActor(actor2, "test")}<br/>
    </Page>
  );
}

export default observer(ActiveDataTest);

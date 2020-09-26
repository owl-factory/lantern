import React from "react";
import Breadcrumbs from "../../../../components/design/Breadcrumbs";
import GameSystemForm from "../../../../components/admin/gameSystems/Form";
import Page from "../../../../components/design/Page";
import gql from "graphql-tag";
import { NextPageContext } from "next";
import ThemeModel from "../../../../models/database/themes";
import { def } from "../../../../utilities/tools";
import { client } from "../../../../utilities/graphql/apiClient";
import { GameSystemInput } from "@reroll/model/dist/inputs/GameSystemInput";
import { GameSystem } from "@reroll/model/dist/documents/GameSystem";
import { useRouter } from "next/router";

interface EditGameSystemProps {
  gameSystem: GameSystem;
  themes: ThemeModel[];
}

/**
 * Renders a the page to create a new game system
 * @param gameSystem The game system to be edited
 * @param themes The themes to render within the form
 */
function EditGameSystem({gameSystem, themes}: EditGameSystemProps) {
  const router = useRouter();

  
  function updateGameSystem(values: GameSystemInput) {
    const updateGameSystem = gql`mutation{
      updateGameSystem (_id: "${gameSystem._id}", data: {
        name: "${values.name}",
        alias: "${values.alias}",
        description: "${values.description}",
        defaultThemeID: "${values.defaultThemeID}",
      }) {
        ok
      }
    }`;

    client.mutate({mutation: updateGameSystem})
    .then((res: any) => {
      router.push(`/admin/game-systems/${values.alias}`)
      console.log("Updated!")
    })
  }

  // TODO - handle if gamesystem is empty
  const name = gameSystem.name || "";
  return (
    <Page>
      <h1>Create Game System</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", name, "Edit"]}/>

      <br/>

      <GameSystemForm 
        initialValues={gameSystem}
        onSubmit={
          (values: GameSystemInput) => updateGameSystem(values)}
        themes={themes}
      />
    </Page>
  );
}

EditGameSystem.getInitialProps = async (ctx: NextPageContext) => {
  const alias = ctx.query.alias;
  
  const query = gql`
  query {
    gameSystem (_id: "${alias}") {
      _id,
      name,
      alias,
      description,
      defaultThemeID
    }
  }`;

  const { data, loading } = await client.query({query: query});
  
  return { 
    themes: [{"name": "Default", "id": "default"}],
    gameSystem: data.gameSystem
  };
}

export default EditGameSystem;

import React from "react";
import Page from "../../../../../components/design/Page";
import Breadcrumbs from "../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import gql from "graphql-tag";
import { client } from "../../../../../utilities/graphql/apiClient";
import { useRouter } from "next/router";
import ModuleForm from "../../../../../components/admin/modules/Form";
import { GameSystem } from "@reroll/model/dist/documents";
import { FetchError } from "node-fetch";
import { GraphQLResponse } from "../../../../../types/graphql";
import { CreateModuleInput } from "@reroll/model/dist/inputs";

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown 
 */
export function NewModuleForm(props: {gameSystem: GameSystem}): JSX.Element {
  const router = useRouter();
  return <ModuleForm 
    initialValues={{
      name: "",
      alias: "",
      description: "",
      isPurchasable: false,
      cost: 0
    }}
    onSubmit={(values: CreateModuleInput) => {
      const NewModuleMutation = gql`
      mutation {
        newModule (data: {
          gameSystemID: "${props.gameSystem._id}",
          name: "${values.name}",
          alias: "${values.alias}"
        }) {
          _id,
          alias
        }
      }
      `;
      client.mutate({mutation: NewModuleMutation})
      .then((res: GraphQLResponse) => {
        const gameSystemAlias = router.query.gameSystemAlias;
        const key = res.data.newModule.alias || res.data.newModule._id;
        router.push(`/admin/game-systems/${gameSystemAlias}/modules/${key}`)
      })
      .catch((error: FetchError) => {
        // TODO - Better error handling
        console.log(error)
      });
    }}
  />;
}

export default function NewModule({ gameSystem }: { gameSystem: GameSystem }): JSX.Element {
  return (
    <Page>
      <h1>New {gameSystem.name} Module</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", gameSystem.name || "", "New Module"]}/>
      <NewModuleForm gameSystem={gameSystem}/>
    </Page>
  )
}

NewModule.getInitialProps = async (ctx: NextPageContext) => {
  const alias = ctx.query.gameSystemAlias;

  const query = gql`query {
    gameSystem (_id: "${alias}") {
      _id,
      name
    }
  }`;

  const { data } = await client.query({query: query});
  return { 
    gameSystem: data.gameSystem
  };
}
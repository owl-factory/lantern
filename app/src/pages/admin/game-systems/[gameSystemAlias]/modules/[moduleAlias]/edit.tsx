import React from "react";
import { useRouter } from "next/router";
import ModuleForm from "../../../../../../components/admin/modules/Form";
import gql from "graphql-tag";
import { client } from "../../../../../../utilities/graphql/apiClient";
import Page from "../../../../../../components/design/Page";
import Breadcrumbs from "../../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import { Module, GameSystem } from "@reroll/model/dist/documents";
import { UpdateModuleInput } from "@reroll/model/dist/inputs";
import { FetchError } from "node-fetch";

interface EditModuleFormProps {
  gameSystem: GameSystem;
  module: Module;
}

interface EditModuleProps {
  gameSystem: GameSystem;
  module: Module
}

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown 
 */
export function EditModuleForm(props: EditModuleFormProps): JSX.Element {
  const router = useRouter();
  return <ModuleForm 
    initialValues={{
      name: props.module.name,
      alias: props.module.alias,
    }}
    onSubmit={(values: UpdateModuleInput) => {
      const { gameSystemAlias, moduleAlias } = router.query;

      const EditModuleMutation = gql`
      mutation {
        updateModule (
          _id: "${props.module._id}",
          data: {
            name: "${values.name}",
            alias: "${values.alias}"
          }
        ) {
          ok
        }
      }
      `;
      
      client.mutate({mutation: EditModuleMutation})
      .then(( ) => {
        router.push(`/admin/game-systems/${gameSystemAlias}/modules/${moduleAlias}`)
      })
      .catch((error: FetchError) => {
        // TODO - Better error handling
        console.log(error)
      });
    }}
  />;
}

export default function EditModule({ gameSystem, module }: EditModuleProps): JSX.Element {
  return (
    <Page>
      <h1>New {gameSystem.name} Module</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", gameSystem.name, "Modules", ]}/>
      <EditModuleForm gameSystem={gameSystem} module={module} />
    </Page>
  )
}

EditModule.getInitialProps = async (ctx: NextPageContext) => {
  const { gameSystemAlias, moduleAlias } = ctx.query;

  const query = gql`query {
    gameSystem (_id: "${gameSystemAlias}") {
      _id,
      name,
      defaultModuleID
    },
    module (_id: "${moduleAlias}") {
      _id,
      name,
      alias,
      description,
      isPublished,
      cost,
      createdAt,
      updatedAt
    }
  }`;

  const { data } = await client.query({query: query});
  return { 
    gameSystem: data.gameSystem,
    module: data.module
  };
}
import React from "react";
import { useRouter } from "next/router";
import ModuleForm from "../../../../../../components/admin/modules/Form";
import { ModuleInput } from "@reroll/model/dist/inputs/ModuleInput";
import gql from "graphql-tag";
import { client } from "../../../../../../utilities/graphql/apiClient";
import Page from "../../../../../../components/design/Page";
import Breadcrumbs from "../../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown 
 */
export function EditModuleForm(props: any) {
  const router = useRouter();
  return <ModuleForm 
    initialValues={{
      name: props.module.name,
      alias: props.module.alias,
      description: props.module.description,
      isPurchasable: props.module.isPurchasable,
      cost: props.module.cost
    }}
    onSubmit={(values: ModuleInput) => {
      const { gameSystemAlias, moduleAlias } = router.query;

      const EditModuleMutation = gql`
      mutation {
        updateModule (
          _id: "${props.module._id}",
          data: {
            name: "${values.name}",
            alias: "${values.alias}",
            description: "${values.description}",
            isPurchasable: ${values.isPurchasable || false},
            cost: ${(values.cost || 0) * 100}
          }
        ) {
          ok
        }
      }
      `;
      
      client.mutate({mutation: EditModuleMutation})
      .then((res: any, ) => {
        router.push(`/admin/game-systems/${gameSystemAlias}/modules/${moduleAlias}`)
      })
      .catch((error: any) => {
        // TODO - Better error handling
        console.log(error)
      });
    }}
  />;
}

export default function NewModule({ gameSystem, module }: any) {
  return (
    <Page>
      <h1>New {gameSystem.name} Module</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", gameSystem.name, "Modules", ]}/>
      <EditModuleForm gameSystem={gameSystem} module={module} />
    </Page>
  )
}

NewModule.getInitialProps = async (ctx: NextPageContext) => {
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
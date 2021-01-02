import React from "react";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import Page from "../../../../components/design/Page";
import Breadcrumbs from "../../../../components/design/Breadcrumbs";
import CommonEntityTypeForm from "../../../../components/admin/commonEntityTypes/Form";
import { CommonEntityType } from "../../../../types/documents";

interface EditCommonEntityTypeFormProps {
  commonEntityType: CommonEntityType;
}

interface EditCommonEntityTypeProps {
  commonEntityType: CommonEntityType;
}

/**
 * Renders a new game system form
 */
export function EditCommonEntityTypeForm(props: EditCommonEntityTypeFormProps): JSX.Element {
  const router = useRouter();
  return <CommonEntityTypeForm
    initialValues={{
      name: props.commonEntityType.name,
      alias: props.commonEntityType.alias,
    }}
    onSubmit={(values: any) => { }}
  />;
}

export default function EditCommonEntityType({ commonEntityType }: EditCommonEntityTypeProps): JSX.Element {
  return (
    <Page>
      <h1>New {commonEntityType.name} Module</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Common Entity Types", commonEntityType.name, "Edit" ]}/>
      <EditCommonEntityTypeForm commonEntityType={commonEntityType} />
    </Page>
  );
}

EditCommonEntityType.getInitialProps = async (ctx: NextPageContext) => {
  const { alias } = ctx.query;

  return {
    commonEntityType: {},
  };
};

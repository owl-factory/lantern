import React from "react";
import Page from "../../components/design/Page";
import { AtomType } from "../../components/layouts/atoms";
import { CardLayout } from "../../components/layouts/CardLayout";

export default function ID(props: any) {
  return (
    <Page>
      <CardLayout
        content={props.content}
        contentType={props.contentType}
        rules={props.rules}
      />
    </Page>
  )
}

ID.getInitialProps = () => {
  return {
    content: {},
    contentType: {
      layout: {
        header: [
          { type: AtomType.Text, dynamicValues: { text: "content.name" } }
        ]
      }
    },
    rules: []
  }
}

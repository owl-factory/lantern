import React from "react";
import { Page } from "components";

export default function TablePage(props: TablePageProps): JSX.Element {
  return (
    <Page>
      Table!
    </Page>
  );
}

TablePage.getInitialProps = async () => {
  return {};
};

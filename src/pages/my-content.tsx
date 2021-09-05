import { Page } from "components/design";
import { NextPageContext } from "next";
import React from "react";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { InitialProps } from "types/client";
import { ContentDocument } from "types/documents";
import { getSession } from "utilities/auth";
import { rest } from "utilities/request";
import { GiAxeSword } from 'react-icons/gi';
import { MdContentCopy, MdDeleteForever, MdEdit } from "react-icons/md";
import { Loading } from "components/style";

interface MyContentProps extends InitialProps {
  contents: ContentDocument[];
}

interface ContentRowProps {
  content: ContentDocument;
}

function ContentRow(props: ContentRowProps) {
  return (
    <tr>
      <td><GiAxeSword/></td>
      <td>{props.content.name}</td>
      <td>{props.content.type.name || <Loading/>}</td>
      <td>{props.content.ruleset.name || <Loading/>}</td>
      <td>
        <ButtonGroup>
          <Button><MdContentCopy/></Button>
          <Button><MdEdit/></Button>
          <Button><MdDeleteForever/></Button>
        </ButtonGroup>
      </td>
    </tr>
  );
}


export default function MyContent(props: MyContentProps) {
   const rows: JSX.Element[] = [];
  props.contents.forEach((content: ContentDocument) => {
    rows.push(<ContentRow content={content}/>);
  });
  return (
    <Page>
      <h1>My Content</h1>
      <Table>
        <thead>
          <tr>
            <th>{/* Icon Column */}</th>
            <th>Name</th>
            <th>Type</th>
            <th>Ruleset</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    </Page>
  );
}

interface MyContentResult {
  contents: ContentDocument[];
}

MyContent.getInitialProps = async (ctx: NextPageContext) => {
  const session = getSession(ctx);
  if (!session) {
    return {
      session,
      success: false,
      message: "You must be logged in to view your content",
      contents: [],
    };
  }

  const result = await rest.get<MyContentResult>(`/api/my-content`);
  return {
    session,
    success: result.success,
    message: result.message,
    contents: result.data.contents,
  };
};

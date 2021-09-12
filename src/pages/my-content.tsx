import { Page } from "components/design";
import { NextPageContext } from "next";
import React from "react";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { InitialProps } from "types/client";
import { AnyDocument, ContentDocument } from "types/documents";
import { getSession } from "utilities/auth";
import { rest } from "utilities/request";
import { GiAxeSword } from 'react-icons/gi';
import { MdContentCopy, MdDeleteForever, MdEdit } from "react-icons/md";
import { Loading } from "components/style";
import { observer } from "mobx-react-lite";
import { ContentManager, RulesetManager } from "client/data";

interface MyContentProps extends InitialProps {
  contents: ContentDocument[];
}

interface ContentRowProps {
  content: ContentDocument;
}

/**
 * Renders a single for for the content table.
 * TODO - move this to a new content table component
 * @param content The content to render for a specific row
 * @returns Returns a single row for the Content table
 */
const ContentRow = observer((props: ContentRowProps) => {
  return (
    <tr>
      <td><GiAxeSword/></td>
      <td>{props.content.name}</td>
      <td>{props.content.type.name || <Loading/>}</td>
      <td>{RulesetManager.get(props.content.ruleset.id)?.name || <Loading/>}</td>
      <td>
        <ButtonGroup>
          <Button><MdContentCopy/></Button>
          <Button><MdEdit/></Button>
          <Button><MdDeleteForever/></Button>
        </ButtonGroup>
      </td>
    </tr>
  );
});


/**
 * Renders a page allowing users to search through their own contents.
 * @param success Whether or not the initial props failed
 * @param message The success or error message indicating the error from the intial props
 * @param session The current user's session
 * @param contents The current user's initially fetched contents
 */
function MyContent(props: MyContentProps): JSX.Element {
  const [ contents, setContents ] = React.useState<ContentDocument[]>([]);
  React.useEffect(() => {
    ContentManager.load();
    RulesetManager.load();

    ContentManager.setMany(props.contents);

    const uniqueRulesets = ContentManager.getUniques("ruleset.id");
    RulesetManager.fetchMissing(uniqueRulesets);
  }, []);

  // Use this to prevent too many rerenders
  React.useEffect(() => {
    setContents(ContentManager.getPage({ match }));
  }, [ContentManager]);

  function match(doc: AnyDocument) {
    if (!props.session) { return false; }
    if (props.session.user.id === doc.ownedBy?.id) { return true; }
    return false;
  }

  ContentManager.setMany(props.contents);

  const rows: JSX.Element[] = [];
  contents.forEach((content: ContentDocument) => {
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

export default observer(MyContent);

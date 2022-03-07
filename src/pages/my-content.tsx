import { Page } from "components/design";
import { NextPageContext } from "next";
import React from "react";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { InitialProps } from "types/client";
import { AnyDocument, ContentDocument } from "types/documents";
import { getSession } from "@owl-factory/auth/session";
import { rest } from "@owl-factory/https/rest";
import { GiAxeSword } from 'react-icons/gi';
import { MdContentCopy, MdDeleteForever, MdEdit } from "react-icons/md";
import { Loading } from "@owl-factory/components/loading";
import { observer } from "mobx-react-lite";
import { ContentData } from "controllers/data/ContentData";
import { ContentTypeData } from "controllers/data/ContentTypeData";
import { RulesetData } from "controllers/data/RulesetData";
import { getUniques } from "@owl-factory/utilities/arrays";
import { getMyContent } from "./api/my-content";
import { handleAPI } from "@owl-factory/https/apiHandler";

interface MyContentProps extends InitialProps {
  contents: ContentDocument[];
}

interface ContentRowProps {
  content: Partial<ContentDocument>;
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
      <td>{ContentTypeData.get(props.content.type?.ref as string)?.name || <Loading/>}</td>
      <td>{RulesetData.get(props.content.ruleset?.ref as string)?.name || <Loading/>}</td>
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
  const [ contents, setContents ] = React.useState<Partial<ContentDocument>[]>([]);
  React.useEffect(() => {
    ContentData.setMany(props.contents);

    const uniqueRulesets = getUniques(props.contents, "ruleset.ref");
    RulesetData.load(uniqueRulesets);
  }, []);

  // Use this to prevent too many rerenders
  React.useEffect(() => {
    const contentRefs = ContentData.searching({ group: "owned-content" });
    setContents(ContentData.getMany(contentRefs));
  }, [ContentData.$lastTouched]);

  function match(doc: AnyDocument) {
    if (!props.session) { return false; }
    if (props.session.user.ref === doc.ownedBy?.ref) { return true; }
    return false;
  }

  const rows: JSX.Element[] = [];
  contents.forEach((content: Partial<ContentDocument>) => {
    rows.push(<ContentRow key={content.ref} content={content}/>);
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

export async function getServerSideProps(ctx: NextPageContext) {
  return await handleAPI(ctx, getMyContent);
}


export default observer(MyContent);

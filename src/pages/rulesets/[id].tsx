import { NextPageContext } from "next";
import Error from 'next/error';
import React from "react";
import { MdInfo, MdBuild, MdBlock } from "react-icons/md";
import { Breadcrumbs, IndexTable, Page } from "../../components";
import ContextMenu from "../../components/design/contextMenus/ContextMenu";
import { ContentTypeDoc, RulesetDoc, TableComponentProps } from "../../types";
import { ContextMenuBuilder, TableBuilder } from "../../utilities";
import rest from "../../utilities/request";

interface RulesetPageProps {
  ruleset: RulesetDoc;
}

interface FetchRulesetData {
  ruleset: RulesetDoc;
}

function fetchContentTypes(
  filters: Record<string, unknown>,
  page: number,
  perPage: number,
  sort: string
): any {
  return { content: [], count: 0 };
}

function deleteContentType(context: ContentTypeDoc): void {
  return;
}

// Adds actions for the table builder
const contentTypeActions = new ContextMenuBuilder()
.addLink("Details", MdInfo, "/rulesets/[alias]")
.addLink("Edit", MdBuild, "/rulesets/[alias]/edit")
.addItem("Delete", MdBlock, (context: ContentTypeDoc) => (deleteContentType(context)));

// Builds the table columns
const contentTypeTableBuilder = new TableBuilder()
.addIncrementColumn("")
.addDataColumn("Ruleset", "name", { sortable: true })
.addComponentColumn("Tools", RulesetActions);


/**
 * Renders the actions for the rulesets page
 * @param data A ruleset object
 */
function RulesetActions({ data }: TableComponentProps) {
  return (
    <ContextMenu
      context={{_id: data._id, name: data.name, alias: data.alias || data._id}}
      {...contentTypeActions.renderConfig()}
    />
  );
}

/**
 * Renders the details of a ruleset
 * @param ruleset The ruleset to describe in this page
 */
function RulesetPage({ ruleset }: RulesetPageProps): JSX.Element {
  if (ruleset === undefined) { return <Page><Error statusCode={404}/></Page>; }
  return (
    <Page>
      <Breadcrumbs titles={["Home", "Rulesets", ruleset.name]}/>
      <h1>{ruleset.name}</h1>

      <h2>Content Types</h2>
      <IndexTable 
        content={[]}
        contentCount={0}
        fetchContent={fetchContentTypes}
        filters={{}}
        limit={10}
        sort="name"
        tableBuilder={contentTypeTableBuilder}
      >
        <div>o</div>
      </IndexTable>
    </Page>
  );
}

RulesetPage.getInitialProps = async (ctx: NextPageContext) => {
  const res = await rest.get<FetchRulesetData>(`/api/rulesets/${ctx.query.id}`);
  return { ruleset: res.data.ruleset || undefined };
};

export default RulesetPage;

"use client";

import { graphql } from "lib/graphql";
import { useQuery } from "urql";

const todoContentTypeId = "904c33ee-f41c-4227-8192-16c41dbc206f";

const contentQuery = graphql(`
  query Content($contentTypeId: ID) {
    contentSet(contentTypeId: $contentTypeId) {
      id
      name
      data
    }
  }
`);

export function SsrQueryTest() {
  const [{ data }] = useQuery({
    query: contentQuery,
    variables: { contentTypeId: todoContentTypeId },
  });
  if (!data?.contentSet) {
    return <h3 className="text-red-500 text-lg">Not Logged In</h3>;
  }

  const todosDisplay: JSX.Element[] = [];
  for (const content of data.contentSet) {
    if (content !== null && content.data !== null && content.data.name !== "TODO ITEM") {
      const data = content.data as unknown as { description?: string; done?: boolean };
      todosDisplay.push(
        <ListItem
          key={content.id}
          todo={{
            description: data.description ?? "",
            done: data.done ?? false,
          }}
        />
      );
    }
  }
  return <ul className="items-start mt-4 mb-16">{todosDisplay}</ul>;
}

function ListItem({ todo }: { todo: { description: string; done: boolean } }) {
  return (
    <li>
      {todo.description} - Done: {todo.done.toString()}
    </li>
  );
}

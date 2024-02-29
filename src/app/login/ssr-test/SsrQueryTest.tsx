"use client";

import { graphql } from "lib/graphql";
import { useQuery } from "urql";

const contentQuery = graphql(`
  query Content {
    allContent {
      id
      name
      data
    }
  }
`);

export function SsrQueryTest() {
  const [{ data, error }] = useQuery({ query: contentQuery });
  console.log(data, error);
  let todosDisplay;
  if (data?.allContent) {
    todosDisplay = data.allContent
      .filter((x) => x !== null && x.data !== null && x.data.name !== "TODO ITEM")
      .map(({ id, data }) => (
        <ListItem
          key={id}
          todo={{
            description: content?.data?.description ?? "",
            done: content?.data?.done ?? false,
          }}
        />
      ));
  }

  return todosDisplay ? (
    <ul className="items-start mt-4 mb-16">{todosDisplay}</ul>
  ) : (
    <h3 className="text-red-500 text-lg">Not Logged In</h3>
  );
}

function ListItem({ todo }: { todo: { description: string; done: boolean } }) {
  return (
    <li>
      {todo.description} - Done: {todo.done.toString()}
    </li>
  );
}

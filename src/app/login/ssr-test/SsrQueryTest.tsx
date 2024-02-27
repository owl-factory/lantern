"use client";

import { graphql } from "gql.tada";
import { useQuery } from "urql";

const todosQuery = graphql(`
  query Todos {
    todos {
      description
      done
      id
    }
  }
`);

export function SsrQueryTest() {
  const [{ data }] = useQuery({ query: todosQuery });
  const todos = data?.todos;

  return todos ? (
    <ul className="items-start mt-4 mb-16">
      {todos.map((todo) => (
        <ListItem key={todo.id} todo={{ description: todo.description || "", done: todo.done }} />
      ))}
    </ul>
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

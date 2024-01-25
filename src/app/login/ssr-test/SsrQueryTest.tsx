"use client";

import gql from "graphql-tag";
import { Todo } from "types/database";
import { useQuery } from "urql";

const todosQuery = gql`
  query Todos {
    todos {
      description
      done
      id
    }
  }
`;

export function SsrQueryTest() {
  const [res] = useQuery({ query: todosQuery });
  const todos = res?.data?.todos as Todo[] | undefined;

  return todos ? (
    <ul className="items-start mt-4 mb-16">
      {todos.map((todo) => (
        <ListItem key={todo.id} todo={todo} />
      ))}
    </ul>
  ) : (
    <h3 className="text-red-500 text-lg">Not Logged In</h3>
  );
}

function ListItem({ todo }: { todo: Todo }) {
  return (
    <li>
      {todo.description} - Done: {todo.done.toString()}
    </li>
  );
}

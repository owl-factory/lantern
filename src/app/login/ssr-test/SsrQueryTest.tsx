"use client";

import { Todo } from "types/database";
import { gql, useQuery } from "urql";

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
  const list = res?.data?.todos?.map((todo: Todo, index: number) => {
    return (
      <li key={`todo-${index}`}>
        {todo.description} - Done: {todo.done.toString()}
      </li>
    );
  });

  return (
    <section
      id="gql-test-ssr"
      className="mt-3 text-lg text-gray-300 px-14 pt-2 flex flex-col items-center"
    >
      <h2 className="text-2xl text-white text-center pt-5">Todo List - Server Side Rendered</h2>
      {list ? (
        <ul className="items-start mt-4 mb-16">{list}</ul>
      ) : (
        <h3 className="text-red-500 text-lg">Not Logged In</h3>
      )}
    </section>
  );
}

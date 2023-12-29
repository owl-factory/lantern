import { database } from "lib/database";
import type { Todo } from "types/database";

interface TodoGetOptions {
  params: {
    /** Todo item database id to search by. */
    id: string;
  };
}

/**
 * Gets a single todo list item by id.
 * @param _request - Ignored web standard request object.
 * @param options - Options object that contains needed url parameters.
 * @returns single todo list item.
 */
export async function GET(_request: Request, options: TodoGetOptions) {
  const todo: Todo = await database
    .selectFrom("todo")
    .where("id", "=", options.params.id)
    .selectAll()
    .executeTakeFirst();
  return Response.json(todo);
}

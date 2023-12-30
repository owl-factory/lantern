import { database } from "lib/database";
import type { Todo, TodoUpdate } from "types/database";

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

/**
 * Creates updates a todo list item.
 * @param request - Web standard request object that contains the POST body.
 * @returns newly created todo item.
 */
export async function PATCH(request: Request, options: TodoGetOptions) {
  const todoUpdate: TodoUpdate = await request.json();
  if (todoUpdate.id && todoUpdate.id != options.params.id) {
    return Response.json("ID in request body does not match ID in URL parameters.", { status: 422 });
  }
  const result = await database
    .updateTable("todo")
    .set(todoUpdate)
    .where("id", "=", options.params.id)
    .returningAll()
    .executeTakeFirst();
  return Response.json(result);
}

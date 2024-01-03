import { authenticateSession } from "lib/authentication";
import { database } from "lib/database";
import { NextRequest } from "next/server";
import type { Todo, TodoUpdate } from "types/database";

interface TodoGetOptions {
  params: {
    /** Todo item database id to search by. */
    id: string;
  };
}

/**
 * /api/todo/[id]:
 * Gets a single todo list item by id.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @param options - Options object that contains needed url parameters.
 * @returns single todo list item.
 */
export async function GET(request: NextRequest, options: TodoGetOptions) {
  const { authenticated } = await authenticateSession(request);
  if (!authenticated) {
    return new Response("User authentication failed.", { status: 401 });
  }

  const todo: Todo = await database
    .selectFrom("todo")
    .where("id", "=", options.params.id)
    .selectAll()
    .executeTakeFirst();

  return Response.json(todo);
}

/**
 * /api/todo/[id]:
 * Updates a todo list item.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @returns newly created todo item.
 */
export async function PATCH(request: NextRequest, options: TodoGetOptions) {
  const { authenticated } = await authenticateSession(request);
  if (!authenticated) {
    return new Response("User authentication failed.", { status: 401 });
  }

  const todoUpdate: TodoUpdate = await request.json();
  if (todoUpdate.id && todoUpdate.id != options.params.id) {
    return new Response("ID in request body does not match ID in URL parameters.", { status: 422 });
  }

  const result = await database
    .updateTable("todo")
    .set(todoUpdate)
    .where("id", "=", options.params.id)
    .returningAll()
    .executeTakeFirst();

  return Response.json(result);
}

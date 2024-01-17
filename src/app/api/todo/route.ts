import { authenticateSession } from "lib/authentication";
import { database } from "lib/database";
import { type NextRequest } from "next/server";
import type { NewTodo, Todo } from "types/database";

/**
 * /api/todo:
 * Gets all todo list items from the database.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @returns array of todo list items.
 */
export async function GET(request: NextRequest) {
  const auth = await authenticateSession(request);
  if (auth.ok === false) {
    return new Response(auth.error, { status: 401 });
  }

  const todos: Todo[] = await database.selectFrom("todo").selectAll().execute();
  return Response.json(todos);
}

/**
 * /api/todo:
 * Creates a new todo list item in the database.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @returns newly created todo item.
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateSession(request);
  if (auth.ok === false) {
    return new Response(auth.error, { status: 401 });
  }

  const newTodo: NewTodo = await request.json();
  const todo = await database.insertInto("todo").values(newTodo).returningAll().executeTakeFirst();
  return Response.json(todo);
}

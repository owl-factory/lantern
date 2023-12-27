/* eslint-disable tsdoc/syntax */
import { database } from "lib/database";
import type { NewTodo, Todo } from "types/database";

/**
 * @swagger
 * /api/todos:
 *   get:
 *     description: Gets all todo list items from the database.
 *     responses:
 *       200:
 *         description: success
 * @returns array of todo list items.
 */
export async function GET() {
  const todos: Todo[] = await database.selectFrom("todos").selectAll().execute();
  return Response.json(todos);
}

export async function POST(request: Request) {
  const newTodo: NewTodo = await request.json();
  return await database.insertInto("todos").values(newTodo).returningAll().executeTakeFirstOrThrow();
}

/* eslint-disable tsdoc/syntax */
import { database } from "lib/database";
import type { NewTodo, Todo } from "types/database";

/**
 * @swagger
 * /api/todo:
 *   get:
 *     description: Gets all todo list items from the database.
 *     responses:
 *       200:
 *         description: success
 * @returns array of todo list items.
 */
export async function GET() {
  const todo: Todo[] = await database.selectFrom("todo").selectAll().execute();
  return Response.json(todo);
}

export async function POST(request: Request) {
  const newTodo: NewTodo = await request.json();
  const result = await database.insertInto("todo").values(newTodo).returningAll().executeTakeFirstOrThrow();
  return Response.json(result);
}

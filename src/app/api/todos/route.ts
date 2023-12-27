import { database } from "lib/database";
import type { NewTodo, Todo } from "types/database";

export async function GET() {
  const todos: Todo[] = await database.selectFrom("todos").selectAll().execute();
  return Response.json(todos);
}

export async function POST(request: Request) {
  const newTodo: NewTodo = await request.json();
  return await database.insertInto("todos").values(newTodo).returningAll().executeTakeFirstOrThrow();
}

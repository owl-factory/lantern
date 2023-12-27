import { database } from "lib/database";
import type { Todo } from "types/database";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const todo: Todo = await database.selectFrom("todos").where("id", "=", params.id).selectAll().executeTakeFirst();
  return Response.json(todo);
}

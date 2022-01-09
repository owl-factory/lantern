import { Expr } from "faunadb";

export interface FaunaDocument {
  ref?: Expr;
  data: Record<string, unknown>;
  ts?: number;
  ttl?: number;
}
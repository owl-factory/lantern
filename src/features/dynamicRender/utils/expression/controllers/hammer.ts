import { ExpressionController } from "./common";

/** A controller that clones data to the web worker on each update, avoiding the need to get specific variables */
export class HammerExpressionController extends ExpressionController {}

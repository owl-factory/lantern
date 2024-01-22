/** A controller for managing the parsing of and evaluation of expressions */
export class ExpressionController {
  _state: ExpressionControllerState = ExpressionControllerState.NoOp;
  _webWorker!: Worker;
  constructor() {}
}

/** Defines the different valid states of the Expression Controller */
enum ExpressionControllerState {
  /** Nothing has been done for the Expression Controller */
  NoOp,

  /** The Expression Controller is ready to use */
  Ready,
}


export class Tokenizer {
  _text!: string;
  /** The cursor position within the string */
  _cursor!: number;
  _done!: boolean;
  _previous: string[] = [];

  /** The current state of the token */
  _tokenState = TokenState.Default;

  _stack!: unknown[];

  /** Marks a backslash as currently active */
  _backslash!: boolean;

  // Debugging
  /** The current column position on this line */
  _column!: number;
  /** The current line number */
  _line!: number;
  /** The error encountered while parsing, if any */
  _error: string | undefined;

  constructor() {
    this._reset();
  }

  fromStringLiteral(text: string) {
    this._reset();
    this._tokenState = TokenState.Literal;

    this._text = stringify(text);
  }

  _reset() {
    this._cursor = -1;
    this._done = false;

    this._column = 1;
    this._line = 1;
    this._error = undefined;
  }

  _next() {
    this._cursor += 1;
    this._column += 1;

    const isDone = this._cursor >= this._text.length;
    if (isDone) return this._canClose();

    const current = this._text[this._cursor];

    const nextState = getNextState(this._tokenState, current);

    const isFinalCharacter = (this._cursor + 1) >= this._text.length;
    if (isFinalCharacter) return this._markDone();
    

  }

  _canClose() {
    if 
  }

  _markDone(error?: string) {
    this._done = true;
    if (error) this._error = error;
  }
}

enum TokenState {
  /** The default starting state */
  Default,
  /** An ordinary string */
  String,
  /** String literal */
  Literal,
}

type Token = {

}

enum TokenType {
  Quote,
  Operator,
}

export type Tokenized = {
  
  
}

function stringify(text: unknown): string {
  switch (typeof text) {
    case "string": return text;
    case "number":
    case "boolean":
    case "undefined":
      return "" + text;
    case "function":
    case "object":
      if (text === null) return "null";
      return text.toString();
  }
  return "";
}

/**
 * Determines the next state given the current state and the current character.
 * @param tokenState - The current token state
 * @param character - The current character to determine the next state
 * @returns The next token state, if changing, or undefined if no change should occur
 */
function getNextState(tokenState: TokenState, character: string, previous: string[]): TokenState | undefined {
  switch (tokenState) {
    case TokenState.Literal:
      return getNextStateFromLiteral(character, previous);
  }
}

function getNextStateFromLiteral(character: string, previous: string[]) {
  const backslash = previous.length && previous[0] === '\\';

  switch (character) {
    case "`":
      if (backslash) return 
      
  }
}
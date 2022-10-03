import { Scalar } from "types";
import { ActorContent } from "types/documents/Actor";
import { StaticVariableValue } from "types/documents/subdocument/StaticVariable";
import { SandboxWorkerMessage, SandboxWorkerRenderMessage, SandboxWorkerSetMessage } from "../types/workers";

/**
 * Runs a small function within a sandboxed environment
 */
export default () => {
  const global = self;

  // WHITELISTING BOILERPLATE //
  const wl = {
    "self": 1,
    "onmessage": 1,
    "postMessage": 1,
    "global": 1,
    "wl": 1,
    "eval": 1,
    "Array": 1,
    "Boolean": 1,
    "Date": 1,
    "Function": 1,
    "Number": 1,
    "Object": 1,
    "RegExp": 1,
    "String": 1,
    "Symbol": 1, // TODO - double check that this is safe
    "Error": 1,
    "EvalError": 1,
    "RangeError": 1,
    "ReferenceError": 1,
    "SyntaxError": 1,
    "TypeError": 1,
    "URIError": 1,
    "decodeURI": 1,
    "decodeURIComponent": 1,
    "encodeURI": 1,
    "encodeURIComponent": 1,
    "isFinite": 1,
    "isNaN": 1,
    "parseFloat": 1,
    "parseInt": 1,
    "Infinity": 1,
    "JSON": 1,
    "Math": 1,
    "NaN": 1,
    "undefined": 1,

    // Chrome errors if you attempt to write over either of these properties, so put them in the whitelist
    "TEMPORARY": 1,
    "PERSISTENT": 1,

    // TODO - Testing values below here. Remove for production
    "console": 1,
  };

  // Loops through all of the property names for the global object. For anything that is not whitelisted,
  //  redefine to throw an error instead
  Object.getOwnPropertyNames( global ).forEach( function(prop) {
    // If the whitelist has this property, do nothing
    if (Object.prototype.hasOwnProperty.call(wl, prop)) { return; }

    Object.defineProperty(global, prop, {
      get: function() {
        throw `Security Exception: cannot access ${prop}`;
      },
      configurable: false,
    });
  });

  // Loops through all of the property names for the global object. For anything that is not whitelisted,
  //  redefine to throw an error instead
  Object.getOwnPropertyNames( (global as any).__proto__ ).forEach( function(prop) {
    // If the whitelist has this property, do nothing
    if (Object.prototype.hasOwnProperty.call(wl, prop)) { return; }

    Object.defineProperty((global as any).__proto__, prop, {
      get: function() {
        throw `Security Exception: cannot access ${prop}`;
      },
      configurable: false,
    });
  });

  // Monkeypatches the Array.join() function to limit the maximum length of either the array or the new value between
  // the array values
  Object.defineProperty( Array.prototype, "join", {
    writable: false,
    configurable: false,
    enumerable: false,

    value: monkeypatchArrayJoin(self, Array.prototype.join),
  });

  /**
   * Monkeypatches the Array.prototype.join function to have limits. Attempting to apply the join function to an array
   * of over 500 or with a string length of over 500 throws an error.
   * @param parent The parent Array.prototype.join 'this' value
   * @param old The old join function
   * @returns The value of the old function if no limits are exceeded
   */
  function monkeypatchArrayJoin(parent: any, old: (separator: string | undefined) => string) {
    return function (joinArg: string | undefined) {
      if (parent.length > 500 || joinArg && joinArg.length > 500) {
        throw "Exception: too many items";
      }
      return old.apply(parent, [joinArg]);
    };
  }

  // END WHITELISTING BOILERPLATE //

  /**
   * Processes and renders an expression out into a usable string safely.
   * NOTE: All function-defined variables are marked with '$'
   * @param data The data passed in by the message with instructions on how to process the expression
   */
  function renderExpression(data: SandboxWorkerRenderMessage) {
    const res = encapsulateExpr(data.expression, data.properties);
    postMessage({ values: res, success: true, message: "", promiseID: data.promiseID });
  }

  /**
   * Encapsulates the expression to isolate it from any additional variables that it could access
   * @param expr The expression to render
   * @param $properties The potential values that the expression may use when rendering
   * @returns The rendered expression
   */
  function encapsulateExpr(expr: string, $properties?: Record<string, unknown>): string {
    if (!$properties) $properties = {};
    const keys = Object.keys($properties);
    for (const field of keys) {
      const str = `var ${field} = ${JSON.stringify($properties[field])};`;
      eval(str);
    }
    $properties = undefined;
    return eval(`\`${expr}\``);
  }

  /**
   * Handles recieving a message from the main thread and deciding which action to perform
   * @param message The message from the main thread starting the fetch or save processes
   */
  self.onmessage = (message: MessageEvent<SandboxWorkerMessage>) => {
    const data: SandboxWorkerMessage = message.data;
    switch (data.action) {
      // We need to use hard-coded strings here because importing the enums breaks the worker
      case "expression":
        renderExpression(data as SandboxWorkerRenderMessage);
        break;
    }
  };
};

type Self = Window & typeof globalThis & { __proto__: unknown };

/** The initialization code for making a web worker into a sandboxed environment */
export const sandboxInitialization = () => {
  const global = self;

  // WHITELISTING BOILERPLATE //
  const wl = {
    self: 1,
    onmessage: 1,
    postMessage: 1,
    global: 1,
    wl: 1,
    eval: 1,
    Array: 1,
    Boolean: 1,
    Date: 1,
    Function: 1,
    Number: 1,
    Object: 1,
    RegExp: 1,
    String: 1,
    Symbol: 1, // TODO - double check that this is safe
    Error: 1,
    EvalError: 1,
    RangeError: 1,
    ReferenceError: 1,
    SyntaxError: 1,
    TypeError: 1,
    URIError: 1,
    decodeURI: 1,
    decodeURIComponent: 1,
    encodeURI: 1,
    encodeURIComponent: 1,
    isFinite: 1,
    isNaN: 1,
    parseFloat: 1,
    parseInt: 1,
    Infinity: 1,
    JSON: 1,
    Math: 1,
    NaN: 1,
    undefined: 1,

    // Chrome errors if you attempt to write over either of these properties, so put them in the whitelist
    TEMPORARY: 1,
    PERSISTENT: 1,

    // Our custom functions within the sandbox
    handleMessage: 1,

    // TODO - Testing values below here. Remove for production
    console: 1,
  };

  // Loops through all of the property names for the global object. For anything that is not whitelisted,
  //  redefine to throw an error instead
  Object.getOwnPropertyNames(global).forEach(function (prop) {
    // If the whitelist has this property, do nothing
    if (Object.prototype.hasOwnProperty.call(wl, prop)) {
      return;
    }

    Object.defineProperty(global, prop, {
      get: function () {
        // eslint-disable-next-line no-restricted-syntax
        throw `Security Exception: cannot access ${prop}`;
      },
      configurable: false,
    });
  });

  // Loops through all of the property names for the global object. For anything that is not whitelisted,
  //  redefine to throw an error instead
  Object.getOwnPropertyNames((global as Self).__proto__).forEach(function (prop) {
    // If the whitelist has this property, do nothing
    if (Object.prototype.hasOwnProperty.call(wl, prop)) {
      return;
    }

    Object.defineProperty((global as Self).__proto__, prop, {
      get: function () {
        // eslint-disable-next-line no-restricted-syntax
        throw `Security Exception: cannot access ${prop}`;
      },
      configurable: false,
    });
  });

  // Monkeypatches the Array.join() function to limit the maximum length of either the array or the new value between
  // the array values
  Object.defineProperty(Array.prototype, "join", {
    writable: false,
    configurable: false,
    enumerable: false,

    value: monkeypatchArrayJoin(self as Self & Array<unknown>, Array.prototype.join),
  });

  /**
   * Monkeypatches the Array.prototype.join function to have limits. Attempting to apply the join function to an array
   * of over 500 or with a string length of over 500 throws an error.
   * @param parent - The parent Array.prototype.join 'this' value
   * @param old - The old join function
   * @returns The value of the old function if no limits are exceeded
   */
  function monkeypatchArrayJoin(
    parent: Array<unknown>,
    old: (separator: string | undefined) => string
  ) {
    return function (joinArg: string | undefined) {
      if (parent.length > 500 || (joinArg && joinArg.length > 500)) {
        // eslint-disable-next-line no-restricted-syntax
        throw "Exception: too many items";
      }
      return old.apply(parent, [joinArg]);
    };
  }

  // END WHITELISTING BOILERPLATE //
};

export const sandboxEnvironment = `
  self.init = ${sandboxInitialization.toString()}
`;

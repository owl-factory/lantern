export const baseWorkerScript = () => {
  "initFn";

  self.lock = false;
  const $_runInit = () => {
    if (!("init" in self)) {
      $_shitTheBed("No initialization function was provided");
      return;
    }
    const initIsFunction = typeof self.init === "function";
    if (!initIsFunction) {
      $_shitTheBed("Initialization was not a function");
      return;
    }
    self.init;
  };

  self.shitTheBed = (why: string) => {
    self.lock = true;
    // eslint-disable-next-line no-restricted-syntax
    throw why;
  };

  self.onmessage = (message) => {
    console.log("From the worker!");
    postMessage({ id: message.data.id, ok: true, data: "res" });
  };
  $_runInit();
};

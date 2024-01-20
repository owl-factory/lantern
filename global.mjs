Object.defineProperty(Array.prototype, "test", {
  value: function () {
    console.log(this);
  },
});

Object.defineProperty(Array.prototype, "filterMap", {
  value: function (callbackFn, thisArg) {
    const items = this.map(callbackFn, thisArg);
    const filteredItems = items.filter((item) => item !== undefined);
    return filteredItems;
  },
});

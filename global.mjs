Object.defineProperty(Array.prototype, "test", {
  value: function () {
    console.log(this);
  },
});

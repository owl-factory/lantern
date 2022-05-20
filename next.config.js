module.exports = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/dashboard",
          has: [{ type: "cookie", key: "session" }],
        },
      ]
    }
  }
};

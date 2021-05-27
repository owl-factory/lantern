module.exports = {
	target: "serverless",
  future: {
    webpack5: true,
  },
  webpack: (config, options) => {
    config.externals.push("bufferutil", "utf-8-validate");
    return config;
  },
	async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/",
        permanent: true,
      },
    ]
  },
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

module.exports = {
	target: "serverless",
	async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/',
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

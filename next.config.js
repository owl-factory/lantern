module.exports = {
	target: "serverless",
  webpack: (config, options) => {
    config.externals.push("bufferutil", "utf-8-validate");
    return config;
  }
};

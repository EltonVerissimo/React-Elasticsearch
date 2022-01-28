module.exports = {
  resolve: {
    fallback: {
      url: false,
      buffer: false,
      assert: false,
      util: false,
      http: false,
      https: false,
      stream: false,
      querystring: false,
      os: false,
      zlib: false,
    },
  },
};

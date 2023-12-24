// eslint-disable-next-line no-undef
module.exports = {
  overrides: [{
    "files": [ "src/**/*.ts[x]", "src/**/*.js[x]" ],
  }],
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    "no-case-declarations": 0,
    "no-constant-condition": 0,
    // "no-multiple-empty-lines": { max: 2, maxEOF: 1, maxBOF: 0 },
    "no-console": 0,
    "eqeqeq": 2,
    "@typescript-eslint/no-shadow": 2,
    "semi": 1,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "comma-dangle": [1, "always-multiline"],
    "sort-imports": [1, {
      "ignoreDeclarationSort": true,
    }],
    "@typescript-eslint/ban-types": 0,
    "no-trailing-spaces": 1,
    "eol-last": 1,
    "max-len": [2, {
      "code": 120,
      "tabWidth": 2,
      "ignoreUrls": true,
    }],
  },
};

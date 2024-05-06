module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    'unused-imports',
  ],
  rules: {
    // syntax
    "semi": ["warn", "always"],
    "no-extra-semi": "warn",
    "prefer-const": ["warn", { "destructuring": "all" }],
    "comma-dangle": ["warn", "always-multiline"],
    "padded-blocks": ["warn", "never"],
    "space-before-blocks": ["warn", "always"],

    // whitespace
    "no-trailing-spaces": "warn",

    // object spacing
    "object-curly-spacing": ["warn", "always"],

    // empty blocks
    "no-empty": "warn",
    "no-empty-function": ["warn", { "allow": ["constructors"] }],

    // unused vars and imports
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "warn",

    // typescript rules
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-namespace": "off",

    // empty line spacing
    "eol-last": ["warn", "always"],
    "no-multiple-empty-lines": ["warn", {
      "max": 1,
      "maxEOF": 0,
      "maxBOF": 0
    }],

    "react-refresh/only-export-components": ['warn', { allowConstantExport: true }],
  },
}

/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "drizzle", "import"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    "drizzle/enforce-delete-with-where": [
      "error",
      {
        drizzleObjectName: ["db", "ctx.db"],
      },
    ],
    "drizzle/enforce-update-with-where": [
      "error",
      {
        drizzleObjectName: ["db", "ctx.db"],
      },
    ],
    // Rule to prevent accessing the database directly from Server Actions, and instead use a method of the data layer.
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          {
            target: "./src/lib/actions",
            from: "./src/lib/db",
            message:
              "You should manage the database directly from Server Actions. Use a method of the data layer.",
          },
          {
            target: "./src/app",
            from: "./src/lib/db",
            message:
              "You should not manage the database directly from the app folder. Use a method of the data layer.",
          },
        ],
      },
    ],
  },
};
module.exports = config;

import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    }
  },
  js.configs.recommended,
  {
    rules: {
      // Add any custom rules here
    }
  }
];

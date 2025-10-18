import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      "semi": ["error", "always"], // ponto e vírgula obrigatório
      // "semi": ["error", "never"], // se quiser proibir ponto e vírgula
      "quotes": ["error", "double"], // aspas duplas obrigatórias
      "no-console": "warn", // aviso para console.log
    }
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" }
  },
  {
  "env": {
    "node": true,
    "es2021": true
  }
}

]);

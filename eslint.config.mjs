import js from "@eslint/js";

export default [
  {
    files: ["my_plugins/**/*.js"],
    ...js.configs.recommended,
    rules: {
      ...js.configs.recommended.rules,
      "no-undef": "off", // RPGツクールMZで定義されているクラスやグローバル変数などを使うため無効化
      "no-unused-vars": ["warn", {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      }],
      indent: ["error", 2, { SwitchCase: 1 }],
      "linebreak-style": ["error", "unix"],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
      quotes: ["warn", "single", { avoidEscape: true }], // コアスクリプトでは double quotes なので warn に留める
    },
  },
];

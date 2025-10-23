/** @type {import("stylelint").Config} */
export default {
  "extends": ["stylelint-config-standard", "stylelint-config-css-modules"],
  "plugins": ["stylelint-prettier"],
  "rules": {
    "prettier/prettier": [true, {
        "singleQuote": true,
        "tabWidth": 2,
        "printWidth": 30,
        "trailingComma": "all",
        "useTabs": false,
        "endOfLine": "lf",
    }]
  }
};

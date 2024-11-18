/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  endOfLine: "lf",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  importOrder: [
    "^(react/(.*)$)|^(react$)", // React imports
    "",
    "^(next/(.*)$)|^(next$)",   // Next.js imports
    "",
    "<THIRD_PARTY_MODULES>",    // Other external libraries
    "",
    "^@/(.*)$",                 // Internal aliases (e.g., @/components)
    "",
    "^[./]",                    // Relative imports
    "",
    "<TYPES>^(react/(.*)$)|^(react$)", // React type imports
    "<TYPES>^(next/(.*)$)|^(next$)",   // Next.js type imports
    "<TYPES><THIRD_PARTY_MODULES>",    // Third-party type imports
    "<TYPES>^@/(.*)$",                 // Internal alias type imports
    "<TYPES>^[./]",                    // Relative type imports
  ],
  importOrderSeparation: true, // Enforce blank lines between groups
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  tailwindAttributes: ["tw"],
  tailwindFunctions: ["cva"],
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
}

export default config

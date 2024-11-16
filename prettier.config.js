/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  endOfLine: "lf",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  importOrder: [
    "^(react/(.*)$)|^(react$)", // React first
    "",
    "^(next/(.*)$)|^(next$)", // Next.js imports
    "<THIRD_PARTY_MODULES>",   // Other external libraries
    "",
    "^@/(.*)$",                // Internal aliases (e.g., @/components)
    "",
    "^[./]",                   // Relative imports
  ],
  importOrderSeparation: true, // Enforce blank lines between groups
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  tailwindAttributes: ["tw"],
  tailwindFunctions: ["cva"],
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
}

export default config

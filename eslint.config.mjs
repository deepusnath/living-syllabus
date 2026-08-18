import tseslint from "typescript-eslint";

// The boundary rule from docs/ARCHITECTURE.md: packages/core may not import
// frameworks, SDKs, adapters, apps, or Node I/O. Applied to core sources AND
// to the lint fixtures (which exist to prove the rule fires — see
// packages/core/test/boundary.test.ts).
const coreBoundaryRule = {
  "no-restricted-imports": [
    "error",
    {
      patterns: [
        { group: ["next", "next/*", "react", "react/*", "react-dom", "react-dom/*"], message: "core is framework-free (docs/ARCHITECTURE.md)" },
        { group: ["@anthropic-ai/*", "openai", "openai/*", "@ai-sdk/*"], message: "model SDKs live in adapters, behind a port" },
        { group: ["@living-syllabus/adapter-*", "@living-syllabus/web", "@living-syllabus/bot"], message: "core cannot depend on adapters or apps" },
        { group: ["**/adapters/**", "**/apps/**"], message: "core cannot depend on adapters or apps" },
        { group: ["fs", "node:fs", "node:fs/*", "child_process", "node:child_process", "http", "node:http", "https", "node:https", "net", "node:net", "dns", "node:dns"], message: "no I/O in core — inject it through a port" },
      ],
    },
  ],
};

export default [
  {
    ignores: ["**/node_modules/**", "**/.next/**", "packages/core/test/fixtures/**", "spikes/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mjs"],
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {},
  },
  {
    files: ["packages/core/src/**/*.ts"],
    rules: coreBoundaryRule,
  },
  {
    // The fixtures are globally ignored above so `npm run lint` stays green;
    // boundary.test.ts lints them with --no-ignore to assert the rule fires.
    files: ["packages/core/test/fixtures/**/*.ts"],
    rules: coreBoundaryRule,
  },
];

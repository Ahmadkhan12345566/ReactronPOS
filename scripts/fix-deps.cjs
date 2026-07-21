const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const patches = [
  {
    path: "node_modules/@tanstack/table-core/build/lib/index.mjs",
    contents: "export * from \"./index.esm.js\";\n",
  },
  {
    path: "node_modules/@react-aria/utils/dist/import.mjs",
    contents: "export * from \"./module.js\";\n",
  },
  {
    path: "node_modules/@react-aria/interactions/dist/useMove.mjs",
    contents: "export * from \"./useMove.module.js\";\n",
  },
  {
    path: "node_modules/@react-aria/interactions/dist/usePress.mjs",
    contents: "export * from \"./usePress.module.js\";\n",
  },
  {
    path: "node_modules/@react-aria/interactions/dist/useScrollWheel.mjs",
    contents: "export * from \"./useScrollWheel.module.js\";\n",
  },
  {
    path: "node_modules/@react-aria/interactions/dist/useLongPress.mjs",
    contents: "export * from \"./useLongPress.module.js\";\n",
  },
  {
    path: "node_modules/@react-aria/interactions/dist/utils.mjs",
    contents: "export * from \"./utils.module.js\";\n",
  },
];

const created = [];

for (const patch of patches) {
  const filePath = path.join(root, patch.path);
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    continue;
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, patch.contents, "utf8");
    created.push(patch.path);
  }
}

if (created.length > 0) {
  console.log("[fix-deps] Added missing ESM wrappers:");
  for (const file of created) {
    console.log(`- ${file}`);
  }
}

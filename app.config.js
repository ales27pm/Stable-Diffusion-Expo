/* eslint-env node */
const fs = require("fs");
const path = require("path");

module.exports = ({ config }) => {
  const plugins = [...(config.plugins ?? [])];
  const buildPropertiesPath = path.join(
    process.cwd(),
    "node_modules",
    "expo-build-properties",
  );

  if (fs.existsSync(buildPropertiesPath)) {
    plugins.push([
      "expo-build-properties",
      {
        ios: {
          deploymentTarget: "16.2",
        },
      },
    ]);
  } else {
    console.warn(
      "[config] expo-build-properties not installed; skipping plugin.",
    );
  }

  return {
    ...config,
    plugins,
  };
};

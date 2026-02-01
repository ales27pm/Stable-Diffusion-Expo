/* eslint-env node */
module.exports = ({ config }) => {
  const plugins = [...(config.plugins ?? [])];
  let hasExpoBuildProperties = false;

  try {
    require.resolve("expo-build-properties/package.json");
    hasExpoBuildProperties = true;
  } catch {
    // expo-build-properties is not installed; skip adding the plugin
  }

  if (hasExpoBuildProperties) {
    plugins.push([
      "expo-build-properties",
      {
        ios: {
          deploymentTarget: "16.2",
        },
      },
    ]);
  }

  return {
    ...config,
    plugins,
  };
};

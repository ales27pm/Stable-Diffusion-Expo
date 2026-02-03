/* eslint-env node */
module.exports = ({ config }) => {
  const plugins = [...(config.plugins ?? [])];
  let hasExpoBuildProperties = false;
  const easProjectId =
    process.env.EAS_PROJECT_ID ?? config.extra?.eas?.projectId ?? null;

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
    extra: {
      ...config.extra,
      eas: easProjectId
        ? {
            ...config.extra?.eas,
            projectId: easProjectId,
          }
        : config.extra?.eas,
    },
    plugins,
  };
};

/* eslint-env jest */
const appConfig = require("../app.config.js");

describe("app.config", () => {
  const baseConfig = {
    name: "AI Art Studio",
    slug: "ai-art-studio",
  };

  afterEach(() => {
    delete process.env.EAS_PROJECT_ID;
  });

  it("preserves existing eas projectId when env is not set", () => {
    const config = appConfig({
      config: {
        ...baseConfig,
        extra: {
          eas: {
            projectId: "existing-project-id",
          },
        },
      },
    });

    expect(config.extra.eas.projectId).toBe("existing-project-id");
  });

  it("uses EAS_PROJECT_ID env override when provided", () => {
    process.env.EAS_PROJECT_ID = "env-project-id";

    const config = appConfig({
      config: {
        ...baseConfig,
        extra: {
          eas: {
            projectId: "existing-project-id",
          },
        },
      },
    });

    expect(config.extra.eas.projectId).toBe("env-project-id");
  });
});

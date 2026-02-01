/* eslint-env jest */
/* global describe, test, expect */
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
  DEFAULT_SECTIONS,
  createAgentsFile,
  updateAgentsFile,
  setSectionContent,
  removeAgentsFile,
  readExistingSections,
  resolveAgentsPath,
} = require("../agents-manager");

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "agents-manager-"));
}

describe("agents-manager", () => {
  test("create/update/set/remove lifecycle", () => {
    const tempDir = createTempDir();
    const agentsPath = resolveAgentsPath(tempDir);

    expect(fs.existsSync(agentsPath)).toBe(false);

    createAgentsFile(agentsPath);
    expect(fs.existsSync(agentsPath)).toBe(true);

    const initialSections = readExistingSections(agentsPath);
    DEFAULT_SECTIONS.forEach((section) => {
      expect(initialSections[section]).toBeTruthy();
    });

    setSectionContent(agentsPath, "Roadmap", "- [x] Done");
    const updatedSections = readExistingSections(agentsPath);
    expect(updatedSections.Roadmap).toBe("- [x] Done");

    updateAgentsFile(agentsPath);
    const preservedSections = readExistingSections(agentsPath);
    expect(preservedSections.Roadmap).toBe("- [x] Done");

    removeAgentsFile(agentsPath);
    expect(fs.existsSync(agentsPath)).toBe(false);
  });
});

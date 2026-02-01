#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const DEFAULT_SECTIONS = [
  "Roadmap",
  "Achievements",
  "Worth noting",
  "Anti-drifting",
  "Full context awareness",
  "Nest in module and function",
];

const DEFAULT_SECTION_BODY = {
  Roadmap: "- [ ] Define upcoming AGENTS.md improvements and milestones.",
  Achievements: "- [ ] Track completed AGENTS.md milestones and wins.",
  "Worth noting": "- [ ] Capture notable constraints, decisions, and context.",
  "Anti-drifting": "- [ ] Record guardrails to prevent scope or goal drift.",
  "Full context awareness":
    "- [ ] Summarize current repository context, dependencies, and active workstreams.",
  "Nest in module and function":
    "- [ ] Describe module/function-level nesting patterns and ownership.",
};

const HEADER = "# AGENTS.md (Auto-Update)";
const INTRO = [
  "This file is managed by `scripts/agents-manager.js`.",
  "Use the CLI to create, update, edit, or remove AGENTS.md files while preserving section content.",
  "",
  "## Quick start",
  "- Create or update: `node scripts/agents-manager.js update <directory>`",
  '- Set a section: `node scripts/agents-manager.js set <directory> --section "Roadmap" --content "..."`',
  "- Remove: `node scripts/agents-manager.js remove <directory>`",
  "",
  "---",
].join("\n");

function resolveAgentsPath(targetPath) {
  if (!targetPath) {
    return path.join(process.cwd(), "AGENTS.md");
  }

  const normalized = path.resolve(targetPath);
  if (normalized.endsWith("AGENTS.md")) {
    return normalized;
  }

  return path.join(normalized, "AGENTS.md");
}

function sectionMarkers(sectionName) {
  const safeName = sectionName.replace(/\s+/g, " ").trim();
  return {
    start: `<!-- agents:section ${safeName}:start -->`,
    end: `<!-- agents:section ${safeName}:end -->`,
  };
}

function extractSectionContent(text, sectionName) {
  const { start, end } = sectionMarkers(sectionName);
  const pattern = new RegExp(
    `${escapeRegExp(start)}([\\s\\S]*?)${escapeRegExp(end)}`,
    "m",
  );
  const match = text.match(pattern);
  if (!match) {
    return DEFAULT_SECTION_BODY[sectionName] || "- [ ] Add content.";
  }
  return (
    match[1].trim() || DEFAULT_SECTION_BODY[sectionName] || "- [ ] Add content."
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}

function buildTemplate(sectionContent) {
  const sectionsOutput = DEFAULT_SECTIONS.map((sectionName) => {
    const { start, end } = sectionMarkers(sectionName);
    const content =
      sectionContent[sectionName] || DEFAULT_SECTION_BODY[sectionName] || "";
    return [
      `## ${sectionName}`,
      start,
      content.trim() || "- [ ] Add content.",
      end,
    ].join("\n");
  }).join("\n\n");

  return [HEADER, "", INTRO, sectionsOutput, ""].join("\n");
}

function readExistingSections(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const text = fs.readFileSync(filePath, "utf8");
  return DEFAULT_SECTIONS.reduce((acc, sectionName) => {
    acc[sectionName] = extractSectionContent(text, sectionName);
    return acc;
  }, {});
}

function writeAgentsFile(filePath, sectionContent) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const template = buildTemplate(sectionContent);
  fs.writeFileSync(filePath, template, "utf8");
  return template;
}

function createAgentsFile(filePath, { force = false } = {}) {
  if (fs.existsSync(filePath) && !force) {
    throw new Error(
      `AGENTS.md already exists at ${filePath}. Use update or --force.`,
    );
  }
  return writeAgentsFile(filePath, {});
}

function updateAgentsFile(filePath) {
  const existingSections = readExistingSections(filePath);
  return writeAgentsFile(filePath, existingSections);
}

function setSectionContent(filePath, sectionName, content) {
  if (!DEFAULT_SECTIONS.includes(sectionName)) {
    throw new Error(`Unknown section: ${sectionName}`);
  }
  const existingSections = readExistingSections(filePath);
  existingSections[sectionName] = content.trim();
  return writeAgentsFile(filePath, existingSections);
}

function removeAgentsFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

function printUsage() {
  console.log(
    `\nUsage: node scripts/agents-manager.js <command> [path] [options]\n\nCommands:\n  init <path>              Create AGENTS.md (fails if it exists)\n  update <path>            Create or update AGENTS.md, preserving section content\n  set <path>               Update a section with custom content\n  remove <path>            Remove AGENTS.md\n\nOptions for set:\n  --section "Section"       Section name (${DEFAULT_SECTIONS.join(", ")})\n  --content "Text"          Content to place inside the section\n\nExamples:\n  node scripts/agents-manager.js update .\n  node scripts/agents-manager.js set . --section "Roadmap" --content "- [x] Ship it"\n  node scripts/agents-manager.js remove ./docs\n`,
  );
}

function parseArgs(argv) {
  const args = [...argv];
  const options = {};
  while (args.length) {
    const current = args.shift();
    if (!current) continue;
    if (current.startsWith("--")) {
      const key = current.slice(2);
      options[key] = args.shift() || "";
      continue;
    }
    options._ = options._ || [];
    options._.push(current);
  }
  return options;
}

function run() {
  const options = parseArgs(process.argv.slice(2));
  const [command, targetPath] = options._ || [];

  if (
    !command ||
    command === "help" ||
    command === "--help" ||
    command === "-h"
  ) {
    printUsage();
    return;
  }

  const filePath = resolveAgentsPath(targetPath || process.cwd());

  try {
    switch (command) {
      case "init": {
        createAgentsFile(filePath, { force: options.force === "true" });
        break;
      }
      case "update": {
        updateAgentsFile(filePath);
        break;
      }
      case "set": {
        if (!options.section || !options.content) {
          throw new Error("set requires --section and --content");
        }
        setSectionContent(filePath, options.section, options.content);
        break;
      }
      case "remove": {
        removeAgentsFile(filePath);
        break;
      }
      default:
        printUsage();
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  run();
}

module.exports = {
  DEFAULT_SECTIONS,
  createAgentsFile,
  updateAgentsFile,
  setSectionContent,
  removeAgentsFile,
  buildTemplate,
  readExistingSections,
  resolveAgentsPath,
};

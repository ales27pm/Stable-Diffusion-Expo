# AGENTS.md (Auto-Update)

This file is managed by `scripts/agents-manager.js`.
Use the CLI to create, update, edit, or remove AGENTS.md files while preserving section content.

## Quick start

- Create or update: `node scripts/agents-manager.js update <directory>`
- Set a section: `node scripts/agents-manager.js set <directory> --section "Roadmap" --content "..."`
- Remove: `node scripts/agents-manager.js remove <directory>`

---

## Roadmap

<!-- agents:section Roadmap:start -->

- [ ] Define upcoming AGENTS.md improvements and milestones.
<!-- agents:section Roadmap:end -->

## Achievements

<!-- agents:section Achievements:start -->

- [ ] Track completed AGENTS.md milestones and wins.
<!-- agents:section Achievements:end -->

## Worth noting

<!-- agents:section Worth noting:start -->

- [ ] Capture notable constraints, decisions, and context.
<!-- agents:section Worth noting:end -->

## Anti-drifting

<!-- agents:section Anti-drifting:start -->

- [ ] Record guardrails to prevent scope or goal drift.
<!-- agents:section Anti-drifting:end -->

## Full context awareness

<!-- agents:section Full context awareness:start -->

- [ ] Summarize current repository context, dependencies, and active workstreams.
<!-- agents:section Full context awareness:end -->

## Nest in module and function

<!-- agents:section Nest in module and function:start -->

- [ ] Describe module/function-level nesting patterns and ownership.
<!-- agents:section Nest in module and function:end -->

## Qodo Merge RAG

<!-- agents:section Qodo Merge RAG:start -->

- [ ] Enable RAG context enrichment in Qodo Merge by adding `enable_rag=true` under
      `[rag_arguments]` in the Qodo configuration.
- [ ] Configure `rag_repo_list` to scope semantic search to relevant repositories
      (defaults to the repository with the open PR if left empty).
- [ ] Confirm prerequisites: Qodo Merge Enterprise plan, single-tenant/on-prem
      deployment, and a fully indexed database for search.
- [ ] Supported Git platforms: GitHub, GitLab, Bitbucket, Bitbucket Data Center.
- [ ] RAG is surfaced in `/review` via the Focus area + References list; use
      `/implement` and `/revise` where applicable.
- [ ] Limitations to note: semantic search quality varies, results may be noisy
    across many repos, and indexing + security are required.
<!-- agents:section Qodo Merge RAG:end -->

---
name: diagram-inference
description: Guides diagram type selection when generating Mermaid diagrams
---

When generating a Mermaid diagram (either via `/explain-diagram` or triggered by a plan), choose the diagram type based on:

- **Processes / flows / decisions** → `flowchart TD`
- **API calls / multi-actor interactions** → `sequenceDiagram`
- **Data models / schemas** → `erDiagram`
- **Classes / types / interfaces** → `classDiagram`
- **States / lifecycle** → `stateDiagram-v2`
- **Timelines / phases** → `gantt`
- **Git workflows** → `gitGraph`
- **System architecture** → `C4Context`
- **Pipelines / left-to-right flows** → `flowchart LR`

Produce a single-line JSON object (no markdown fences, no extra text):

{"diagramType":"<type>","title":"<short title>","rationale":"<one sentence>","mermaid":"<mermaid syntax with \\n for newlines>"}

Then render it by piping that JSON to `render-diagram.js` via Bash. The render script path is available as `${CLAUDE_PLUGIN_ROOT}/hooks/render-diagram.js`.

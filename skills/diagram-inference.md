---
name: diagram-inference
description: "REQUIRED for any Mermaid diagram output. Never write raw Mermaid syntax as text — always render to the browser via this skill."
---

Whenever you produce a Mermaid diagram for any reason, you MUST render it in the browser. Never output raw Mermaid code blocks in your text response.

Choose the diagram type based on the content:

- **Processes / flows / decisions** → `flowchart TD`
- **API calls / multi-actor interactions** → `sequenceDiagram`
- **Data models / schemas** → `erDiagram`
- **Classes / types / interfaces** → `classDiagram`
- **States / lifecycle** → `stateDiagram-v2`
- **Timelines / phases** → `gantt`
- **Git workflows** → `gitGraph`
- **System architecture** → `C4Context`
- **Pipelines / left-to-right flows** → `flowchart LR`
- **Implementation plans / step sequences** → `flowchart TD`

Produce a single-line JSON object (no markdown fences, no extra text):

{"diagramType":"<type>","title":"<short title>","rationale":"<one sentence>","mermaid":"<mermaid syntax with \\n for newlines>"}

Then immediately render it — write the JSON to a temp file and pipe it to the render script:

```bash
printf '%s' '<your single-line JSON>' > /tmp/claude-diagram-input.json && node "${CLAUDE_PLUGIN_ROOT}/hooks/render-diagram.js" < /tmp/claude-diagram-input.json
```

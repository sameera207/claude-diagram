---
name: explain-diagram
description: Generate a Mermaid diagram explaining the current context or a specific topic
---

IMPORTANT: Never output raw Mermaid syntax as text. Always render it to the browser using the Bash command at the end of these instructions.

Analyze the user's request and the current conversation context.

Determine the single most appropriate Mermaid diagram type from:
- `flowchart TD` / `flowchart LR`
- `sequenceDiagram`
- `erDiagram`
- `classDiagram`
- `stateDiagram-v2`
- `gantt`
- `gitGraph`
- `C4Context`

Produce a single-line JSON object in exactly this shape (no markdown fences, no other text):

{"diagramType":"<type>","rationale":"<one sentence explaining why this type>","title":"<short human-readable title>","mermaid":"<mermaid syntax with \\n for newlines>"}

Then immediately render it by writing the JSON to a temp file and piping it to the render script:

```bash
printf '%s' '<your single-line JSON>' > /tmp/claude-diagram-input.json && node "${CLAUDE_PLUGIN_ROOT}/hooks/render-diagram.js" < /tmp/claude-diagram-input.json
```

Do not include any Mermaid code blocks or diagram content in your text response — the browser is the output.

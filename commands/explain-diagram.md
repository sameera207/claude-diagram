---
name: explain-diagram
description: Generate a Mermaid diagram explaining the current context or a specific topic
---

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

Generate valid Mermaid syntax for the chosen type.

Produce a JSON object in exactly this shape (no other text, no markdown fences):

```json
{
  "diagramType": "<type>",
  "rationale": "<one sentence explaining why this type>",
  "title": "<short human-readable title>",
  "mermaid": "<mermaid syntax with \\n for newlines>"
}
```

After producing the JSON, execute the following Bash command to render and open the diagram automatically:

```bash
echo '<paste the JSON here as a single line>' | node "${CLAUDE_PLUGIN_ROOT}/hooks/render-diagram.js"
```

Replace `<paste the JSON here as a single line>` with the actual JSON you generated (serialized to a single line, with inner quotes escaped). Do not include any other text after the Bash block.

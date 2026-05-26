---
name: plan-diagram
description: "Use when writing plans, implementation strategies, roadmaps, architectural decisions, or any structured multi-step response that would benefit from a diagram — never use ASCII art; render Mermaid to the browser inline instead"
---

Whenever you write a plan, implementation strategy, architecture overview, roadmap, or any structured response that would benefit from a visual diagram:

NEVER use ASCII art, box-and-line drawings, or raw Mermaid code blocks in your response text.

Instead, render the diagram at the natural point where it belongs:

1. Use the `diagram-inference` skill to choose the right diagram type
2. Render it immediately via Bash:

```bash
printf '%s' '<your single-line JSON>' > /tmp/claude-diagram-input.json && node "${CLAUDE_PLUGIN_ROOT}/hooks/render-diagram.js" < /tmp/claude-diagram-input.json
```

3. In your response text, place this reference line exactly where the diagram belongs:

> _(Diagram rendered to browser above)_

This applies in **any mode** — plan mode, regular conversation, code review responses, etc. The diagram is always inline with the content, never a separate follow-up step.

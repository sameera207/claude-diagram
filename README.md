# claude-diagram

A Claude Code plugin that automatically generates and renders Mermaid diagrams from plans, and lets you request diagrams on demand.

## What it does

- **Auto-diagram on plan creation** — after Claude writes todos (`TodoWrite`) or exits plan mode (`ExitPlanMode`), it automatically generates and renders a Mermaid diagram in your browser.
- **On-demand diagrams** — use `/explain-diagram` to generate a diagram for any topic in the current context.
- **Smart type inference** — Claude picks the right diagram type (flowchart, sequence, ER, class, state, gantt, gitGraph, C4Context) based on your content — no separate API call or API key needed.
- **Full-screen, light-theme viewer** — diagrams fill the browser window and scale to fit regardless of how many elements they contain.
- **Zoom & pan** — scroll to zoom toward the cursor, drag to pan, or use the toolbar buttons. One tab auto-refreshes with each new diagram.
- **Copy Mermaid source** — every rendered diagram includes a "Copy Mermaid Source" button.

## Requirements

- Node.js (available in Claude Code environment)
- Internet access (Mermaid.js loads from CDN)

## Installation

Install via the [sameera207 plugin marketplace](https://github.com/sameera207/claude-plugins#installation).

Inside Claude Code:

```
/plugin marketplace add sameera207/claude-plugins
/plugin install claude-diagram@sameera207
```

## Usage

### Auto-diagram (on plan creation)

1. Ask Claude to make a plan for anything.
2. After Claude writes todos or exits plan mode, it automatically generates a Mermaid diagram and opens it in your browser.

### On-demand: `/explain-diagram`

Type `/explain-diagram` (optionally followed by a topic) and Claude will analyze the context, pick the best diagram type, and open the diagram in your browser immediately.

## Viewer controls

| Control | Action |
|---|---|
| Scroll wheel | Zoom toward cursor |
| Click + drag | Pan |
| `+` / `=` | Zoom in |
| `-` | Zoom out |
| `0` | Reset zoom |
| `⊙` button | Reset zoom |

## Diagram types supported

| Type | When used |
|---|---|
| `flowchart TD` | Process flows, decision trees |
| `sequenceDiagram` | API calls, multi-actor interactions |
| `erDiagram` | Data models, schemas |
| `classDiagram` | OOP structures, type hierarchies |
| `stateDiagram-v2` | State machines, lifecycle flows |
| `gantt` | Timelines, phased plans |
| `gitGraph` | Branch strategies |
| `C4Context` | System architecture |
| `flowchart LR` | Pipelines, left-to-right flows |

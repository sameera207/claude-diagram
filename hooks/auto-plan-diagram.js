#!/usr/bin/env node
'use strict';

const path = require('node:path');

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', chunk => { data += chunk; });
    process.stdin.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch { resolve(null); }
    });
  });
}

function extractPlanContent(input) {
  if (!input) return null;
  const toolName = input.tool_name;
  const toolInput = input.tool_input;
  if (!toolInput) return null;

  if (toolName === 'TodoWrite' && Array.isArray(toolInput.todos)) {
    return toolInput.todos
      .map(t => `- [${t.status || 'pending'}] ${t.content}`)
      .join('\n');
  }

  if (toolName === 'ExitPlanMode' && toolInput.plan) {
    return toolInput.plan;
  }

  return null;
}

async function main() {
  const input = await readStdin();

  if (!input) process.exit(0);

  const planContent = extractPlanContent(input);
  if (!planContent) process.exit(0);

  const renderScript = path.join(
    process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, '..'),
    'hooks', 'render-diagram.js'
  );

  const context = `A plan was just written. Generate a Mermaid diagram for it now.

IMPORTANT: Do NOT output raw Mermaid syntax in your text response. You MUST render it to the browser.

Use the diagram-inference skill to pick the right diagram type, then produce a single-line JSON object in this shape:
{"diagramType":"...","title":"...","rationale":"...","mermaid":"..."}

Render it immediately by writing the JSON to a temp file and piping it to the render script:
printf '%s' '<your single-line JSON>' > /tmp/claude-diagram-input.json && node "${renderScript}" < /tmp/claude-diagram-input.json

Plan content to diagram:
${planContent}`;

  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: context
    }
  }));
}

main().catch(e => {
  process.stderr.write(`claude-diagram: unexpected error: ${e.message}\n`);
  process.exit(0);
});

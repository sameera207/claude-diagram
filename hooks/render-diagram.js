#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const OUTPUT_PATH = '/tmp/claude-diagram.html';

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

function openBrowser(filePath) {
  const opener = process.platform === 'darwin' ? 'open'
    : process.platform === 'win32' ? 'start'
    : 'xdg-open';
  try {
    execSync(`${opener} "${filePath}"`);
  } catch (e) {
    process.stderr.write(`Warning: could not open browser: ${e.message}\n`);
  }
}

async function main() {
  const diagram = await readStdin();

  if (!diagram || !diagram.mermaid) {
    process.stderr.write('render-diagram: invalid or missing diagram JSON\n');
    process.exit(0);
  }

  const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, '..');
  const templatePath = path.join(pluginRoot, 'templates', 'diagram.html');

  let template;
  try {
    template = fs.readFileSync(templatePath, 'utf8');
  } catch (e) {
    process.stderr.write(`render-diagram: cannot read template at ${templatePath}: ${e.message}\n`);
    process.exit(0);
  }

  // Escape mermaid source for safe injection into a JS template literal
  const escapedMermaid = diagram.mermaid
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${');

  const html = template
    .replace(/\{\{DIAGRAM_TITLE\}\}/g, escapeHtml(diagram.title || diagram.diagramType || 'Diagram'))
    .replace(/\{\{DIAGRAM_RATIONALE\}\}/g, escapeHtml(diagram.rationale || ''))
    .replace(/\{\{DIAGRAM_TYPE_BADGE\}\}/g, escapeHtml(diagram.diagramType || ''))
    .replace(/\{\{MERMAID_SOURCE\}\}/g, escapedMermaid);

  try {
    fs.writeFileSync(OUTPUT_PATH, html, 'utf8');
  } catch (e) {
    process.stderr.write(`render-diagram: cannot write ${OUTPUT_PATH}: ${e.message}\n`);
    process.exit(0);
  }

  openBrowser(OUTPUT_PATH);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

main().catch(e => {
  process.stderr.write(`render-diagram: unexpected error: ${e.message}\n`);
  process.exit(0);
});

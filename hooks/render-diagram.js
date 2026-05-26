#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const OUTPUT_PATH = '/tmp/claude-diagram.html';

function printHeader(diagram) {
  const title = diagram.title || diagram.diagramType || 'Diagram';
  const type = diagram.diagramType || '';
  const rationale = diagram.rationale || '';
  const W = 62;
  const bar = '─'.repeat(W);
  const pad = s => s.slice(0, W - 2).padEnd(W - 2);
  process.stdout.write(`\n\x1b[36m┌${bar}┐\x1b[0m\n`);
  process.stdout.write(`\x1b[36m│\x1b[0m \x1b[1m${pad(title)}\x1b[0m \x1b[36m│\x1b[0m\n`);
  if (type) {
    process.stdout.write(`\x1b[36m│\x1b[0m \x1b[2mtype: ${pad('type: ' + type).slice(6)}\x1b[0m \x1b[36m│\x1b[0m\n`);
  }
  if (rationale) {
    const words = rationale.split(' ');
    let cur = '';
    for (const w of words) {
      if (cur && (cur + ' ' + w).length > W - 2) {
        process.stdout.write(`\x1b[36m│\x1b[0m \x1b[2m${pad(cur)}\x1b[0m \x1b[36m│\x1b[0m\n`);
        cur = w;
      } else {
        cur = cur ? cur + ' ' + w : w;
      }
    }
    if (cur) process.stdout.write(`\x1b[36m│\x1b[0m \x1b[2m${pad(cur)}\x1b[0m \x1b[36m│\x1b[0m\n`);
  }
  process.stdout.write(`\x1b[36m└${bar}┘\x1b[0m\n`);
}

function findImgcat() {
  const candidates = [
    '/Applications/iTerm.app/Contents/Resources/utilities/imgcat',
    '/usr/local/bin/imgcat',
    '/usr/bin/imgcat',
  ];
  for (const p of candidates) {
    try { if (fs.statSync(p).isFile()) return p; } catch {}
  }
  try {
    const r = execSync('which imgcat 2>/dev/null', { encoding: 'utf8', stdio: 'pipe' }).trim();
    if (r) return r;
  } catch {}
  return null;
}

function renderInTerminal(diagram) {
  const imgcat = findImgcat();
  if (!imgcat) return false;

  try {
    const payload = JSON.stringify({ code: diagram.mermaid, mermaid: { theme: 'default' } });
    const encoded = Buffer.from(payload).toString('base64url');
    const imgUrl = `https://mermaid.ink/img/${encoded}`;
    const tmpPng = '/tmp/claude-diagram-inline.png';

    execSync(`curl -s -L --max-time 15 -o "${tmpPng}" "${imgUrl}"`, { stdio: 'pipe' });

    let size = 0;
    try { size = fs.statSync(tmpPng).size; } catch {}
    if (size < 200) return false;

    const imgData = execSync(`"${imgcat}" "${tmpPng}"`, { encoding: 'buffer' });
    process.stdout.write(imgData);
    return true;
  } catch (e) {
    process.stderr.write(`render-diagram: terminal render failed: ${e.message}\n`);
    return false;
  }
}

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

  printHeader(diagram);
  const rendered = renderInTerminal(diagram);
  if (rendered) {
    process.stdout.write(`\x1b[2mFull interactive view: ${OUTPUT_PATH}\x1b[0m\n\n`);
  } else {
    openBrowser(OUTPUT_PATH);
  }
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

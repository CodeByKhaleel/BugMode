#!/usr/bin/env node
import * as readline from 'readline';
import { analyzeError } from '@bugmode/core-engine';
import { extractProjectContext } from '@bugmode/parsers';
import { buildPrompt, PromptTarget } from '@bugmode/prompt-builder';

const TARGETS: PromptTarget[] = ['claude', 'cursor', 'generic'];

function getTarget(): PromptTarget {
  const arg = process.argv[2];
  if (arg && TARGETS.includes(arg as PromptTarget)) return arg as PromptTarget;
  return 'claude';
}

async function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data.trim()));
  });
}

async function readInteractive(): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    console.log('Paste your error/stack trace below. Press Ctrl+D when done:\n');
    let data = '';
    rl.on('line', (line) => (data += line + '\n'));
    rl.on('close', () => resolve(data.trim()));
  });
}

async function main() {
  const target = getTarget();
  const isTTY = process.stdin.isTTY;

  const rawError = isTTY ? await readInteractive() : await readStdin();

  if (!rawError) {
    console.error('No input provided. Usage: bugmode [claude|cursor|generic]');
    console.error('  echo "TypeError: ..." | bugmode');
    console.error('  bugmode claude   (then paste and Ctrl+D)');
    process.exit(1);
  }

  const analysis = analyzeError(rawError);
  const projectContext = extractProjectContext(process.cwd(), analysis.relatedFiles);
  const prompt = buildPrompt({ rawError, analysis, projectContext, target });

  console.log('\n' + '─'.repeat(60));
  console.log(prompt.title);
  console.log('─'.repeat(60) + '\n');
  console.log(prompt.content);
  console.log('\n' + '─'.repeat(60));
}

main().catch((err) => {
  console.error('bugmode error:', err);
  process.exit(1);
});

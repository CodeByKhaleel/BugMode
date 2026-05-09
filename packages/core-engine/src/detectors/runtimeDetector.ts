import { Runtime } from '../types';
import { ParsedError } from '../types';

const PYTHON_SIGNALS = ['Traceback (most recent call last)', '.py"', 'File "'];
const BROWSER_SIGNALS = ['webpack://', 'chrome-extension://', 'at HTMLElement', 'at Window'];

export function detectRuntime(parsed: ParsedError): Runtime {
  const text = parsed.raw;

  if (PYTHON_SIGNALS.some((s) => text.includes(s))) return 'python';
  if (BROWSER_SIGNALS.some((s) => text.includes(s))) return 'browser';
  if (parsed.frames.some((f) => f.file.includes('node_modules') || f.file.startsWith('node:')))
    return 'node';
  if (parsed.frames.length > 0) return 'node'; // default for JS stack traces

  return 'unknown';
}

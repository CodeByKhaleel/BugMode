import { ParsedError, StackFrame } from '../types';

// Matches: "  at FunctionName (file.ts:10:5)" or "  at file.ts:10:5"
const NODE_FRAME_RE = /^\s+at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?$/;
// Matches: "  File "file.py", line 10, in fn"
const PYTHON_FRAME_RE = /^\s+File "(.+?)", line (\d+), in (.+)$/;
// Error type line: "TypeError: Cannot read..."
const ERROR_TYPE_RE = /^([A-Za-z][A-Za-z0-9_]*(?:Error|Exception|Warning)?): (.+)$/;

function parseNodeFrames(lines: string[]): StackFrame[] {
  const frames: StackFrame[] = [];
  for (const line of lines) {
    const m = NODE_FRAME_RE.exec(line);
    if (m) frames.push({ fn: m[1] ?? null, file: m[2], line: parseInt(m[3]), column: parseInt(m[4]) });
  }
  return frames;
}

function parsePythonFrames(lines: string[]): StackFrame[] {
  const frames: StackFrame[] = [];
  for (const line of lines) {
    const m = PYTHON_FRAME_RE.exec(line);
    if (m) frames.push({ file: m[1], line: parseInt(m[2]), column: null, fn: m[3] });
  }
  return frames;
}

export function parseStackTrace(raw: string): ParsedError {
  const lines = raw.trim().split('\n');
  const firstLine = lines[0] ?? '';
  const typeMatch = ERROR_TYPE_RE.exec(firstLine);

  const type = typeMatch?.[1] ?? 'Error';
  const message = typeMatch?.[2] ?? firstLine;

  const isPython = lines.some((l) => PYTHON_FRAME_RE.test(l));
  const frames = isPython ? parsePythonFrames(lines) : parseNodeFrames(lines);

  return { type, message, frames, raw };
}

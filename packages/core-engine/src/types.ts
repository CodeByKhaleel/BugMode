export type Runtime = 'node' | 'browser' | 'python' | 'unknown';
export type Framework = 'react' | 'nestjs' | 'express' | 'nextjs' | 'django' | 'fastapi' | 'unknown';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type ErrorCategory =
  | 'type_error'
  | 'null_reference'
  | 'module_not_found'
  | 'syntax_error'
  | 'dependency_injection'
  | 'network'
  | 'permission'
  | 'unknown';

export interface StackFrame {
  file: string;
  line: number | null;
  column: number | null;
  fn: string | null;
}

export interface ParsedError {
  message: string;
  type: string;
  frames: StackFrame[];
  raw: string;
}

export interface AnalysisResult {
  runtime: Runtime;
  framework: Framework;
  errorCategory: ErrorCategory;
  severity: Severity;
  probableCause: string;
  relatedFiles: string[];
  debuggingHints: string[];
  parsed: ParsedError;
}

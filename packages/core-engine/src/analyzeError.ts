import { parseStackTrace } from './parsers/stackTraceParser';
import { detectRuntime } from './detectors/runtimeDetector';
import { detectFramework } from './detectors/frameworkDetector';
import { categorizeError } from './categorizers/errorCategorizer';
import { AnalysisResult } from './types';

export function analyzeError(rawInput: string): AnalysisResult {
  const parsed = parseStackTrace(rawInput);
  const runtime = detectRuntime(parsed);
  const framework = detectFramework(parsed);
  const { category, severity, probableCause, hints } = categorizeError(parsed);

  const relatedFiles = [
    ...new Set(parsed.frames.map((f) => f.file).filter((f) => !f.includes('node_modules'))),
  ].slice(0, 5);

  return {
    runtime,
    framework,
    errorCategory: category,
    severity,
    probableCause,
    relatedFiles,
    debuggingHints: hints,
    parsed,
  };
}

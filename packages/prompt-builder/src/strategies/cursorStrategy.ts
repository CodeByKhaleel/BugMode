import { PromptInput, GeneratedPrompt } from '../types';
import {
  buildContextSection,
  buildErrorSection,
  buildRootCauseSection,
  buildSelectedCodeSection,
} from '../sections/promptSections';

export function buildCursorPrompt(input: PromptInput): GeneratedPrompt {
  const content = `Fix the following error in my codebase.

${buildContextSection(input)}

${buildErrorSection(input)}

${buildRootCauseSection(input)}

${buildSelectedCodeSection(input.selectedCode)}

Apply a minimal fix directly in the relevant file(s). Do not refactor unrelated code.`;

  return {
    target: 'cursor',
    title: `Fix: ${input.analysis.parsed.type} — ${input.analysis.parsed.message.slice(0, 60)}`,
    content,
  };
}

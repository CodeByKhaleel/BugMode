import { PromptInput, GeneratedPrompt } from '../types';
import {
  buildContextSection,
  buildErrorSection,
  buildRootCauseSection,
  buildSelectedCodeSection,
} from '../sections/promptSections';

export function buildClaudePrompt(input: PromptInput): GeneratedPrompt {
  const content = `You are an expert software engineer. Analyze the following bug and provide a precise fix.

${buildContextSection(input)}

${buildErrorSection(input)}

${buildRootCauseSection(input)}

${buildSelectedCodeSection(input.selectedCode)}

## Debugging Objective
Identify the exact root cause and provide a minimal, correct fix. Explain why the error occurs and what the fix does.

## Expected Output Format
1. Root cause (1-2 sentences)
2. Fix (code snippet with explanation)
3. Prevention tip (optional)

Do not add unnecessary abstractions. Keep the fix minimal and targeted.`;

  return {
    target: 'claude',
    title: `[BugMode → Claude] ${input.analysis.parsed.type}: ${input.analysis.parsed.message.slice(0, 60)}`,
    content,
  };
}

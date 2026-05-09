import { PromptInput, GeneratedPrompt, PromptTarget } from './types';
import { buildClaudePrompt } from './strategies/claudeStrategy';
import { buildCursorPrompt } from './strategies/cursorStrategy';
import { buildGenericPrompt } from './strategies/genericStrategy';

const STRATEGIES: Record<PromptTarget, (input: PromptInput) => GeneratedPrompt> = {
  claude: buildClaudePrompt,
  cursor: buildCursorPrompt,
  generic: buildGenericPrompt,
};

export function buildPrompt(input: PromptInput): GeneratedPrompt {
  const strategy = STRATEGIES[input.target] ?? STRATEGIES.generic;
  return strategy(input);
}

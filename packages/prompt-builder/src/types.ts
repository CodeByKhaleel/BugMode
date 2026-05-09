import { AnalysisResult } from '@bugmode/core-engine';
import { ProjectContext } from '@bugmode/parsers';

export type PromptTarget = 'claude' | 'cursor' | 'generic';

export interface PromptInput {
  rawError: string;
  analysis: AnalysisResult;
  projectContext: ProjectContext;
  selectedCode?: string;
  target: PromptTarget;
}

export interface GeneratedPrompt {
  target: PromptTarget;
  title: string;
  content: string;
}

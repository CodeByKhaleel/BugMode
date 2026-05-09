import { PromptInput } from '../types';

export function buildContextSection(input: PromptInput): string {
  const { analysis, projectContext } = input;
  const deps = Object.keys(projectContext.dependencies).slice(0, 8).join(', ') || 'none';
  return `## Project Context
- Type: ${projectContext.projectType}
- Framework: ${projectContext.framework}
- Runtime: ${analysis.runtime}
- TypeScript: ${projectContext.hasTypeScript ? 'yes' : 'no'}
- Package Manager: ${projectContext.packageManager}
- Key Dependencies: ${deps}
${projectContext.architectureHints.length ? `- Architecture: ${projectContext.architectureHints.join('; ')}` : ''}`;
}

export function buildErrorSection(input: PromptInput): string {
  const { analysis } = input;
  const frames = analysis.parsed.frames
    .slice(0, 5)
    .map((f) => `  ${f.fn ?? '<anonymous>'} (${f.file}:${f.line})`)
    .join('\n');
  return `## Error Details
- Type: ${analysis.parsed.type}
- Message: ${analysis.parsed.message}
- Category: ${analysis.errorCategory}
- Severity: ${analysis.severity}

### Stack Trace (top frames)
\`\`\`
${frames || analysis.parsed.raw.split('\n').slice(0, 6).join('\n')}
\`\`\``;
}

export function buildRootCauseSection(input: PromptInput): string {
  const { analysis } = input;
  return `## Probable Root Cause
${analysis.probableCause}

### Related Files
${analysis.relatedFiles.length ? analysis.relatedFiles.map((f) => `- ${f}`).join('\n') : '- (none identified)'}

### Debugging Hints
${analysis.debuggingHints.map((h) => `- ${h}`).join('\n')}`;
}

export function buildSelectedCodeSection(code?: string): string {
  if (!code?.trim()) return '';
  return `## Selected Code
\`\`\`
${code.trim()}
\`\`\``;
}

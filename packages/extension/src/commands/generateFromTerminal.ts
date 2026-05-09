import * as vscode from 'vscode';
import { analyzeError } from '@bugmode/core-engine';
import { extractProjectContext } from '@bugmode/parsers';
import { buildPrompt, PromptTarget } from '@bugmode/prompt-builder';
import { logger } from '../utils/logger';
import { BugModePanel } from '../panel/BugModePanel';

export async function runGenerateFromTerminal(target: PromptTarget, panel: BugModePanel): Promise<void> {
  // Try clipboard first (user may have already copied the error)
  const clipboardText = (await vscode.env.clipboard.readText()).trim();

  const rawError = await vscode.window.showInputBox({
    title: 'BugMode 🐛 — Paste your error',
    placeHolder: 'Paste error / stack trace here...',
    value: clipboardText,
    ignoreFocusOut: true,
    prompt: 'Paste the error or stack trace and press Enter',
  });

  if (!rawError?.trim()) return;

  try {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? process.cwd();
    const analysis = analyzeError(rawError);
    const projectContext = extractProjectContext(workspaceRoot, analysis.relatedFiles);
    const prompt = buildPrompt({ rawError, analysis, projectContext, target });

    await vscode.env.clipboard.writeText(prompt.content);
    panel.showPrompt(prompt);

    vscode.window.showInformationMessage('BugMode 🐛: Prompt ready — paste with Ctrl+V');
    logger.info(`Terminal prompt generated for ${target}`);
  } catch (err) {
    logger.error('Failed to generate terminal prompt', err);
    vscode.window.showErrorMessage(`BugMode: ${String(err)}`);
  }
}

import * as vscode from 'vscode';
import { analyzeError } from '@bugmode/core-engine';
import { extractProjectContext } from '@bugmode/parsers';
import { buildPrompt, PromptTarget } from '@bugmode/prompt-builder';
import { logger } from '../utils/logger';
import { BugModePanel } from '../panel/BugModePanel';

export async function runGenerateFromTerminal(target: PromptTarget, panel: BugModePanel): Promise<void> {
  // Copy terminal selection to clipboard
  await vscode.commands.executeCommand('workbench.action.terminal.copySelection');
  const rawError = (await vscode.env.clipboard.readText()).trim();

  if (!rawError) {
    vscode.window.showWarningMessage('BugMode: Select the error text in the terminal first.');
    return;
  }

  try {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? process.cwd();
    const analysis = analyzeError(rawError);
    const projectContext = extractProjectContext(workspaceRoot, analysis.relatedFiles);
    const prompt = buildPrompt({ rawError, analysis, projectContext, target });

    // Copy prompt to clipboard — user pastes with Ctrl+V wherever they want
    await vscode.env.clipboard.writeText(prompt.content);
    panel.showPrompt(prompt);

    vscode.window.showInformationMessage('BugMode 🐛: Prompt ready — paste with Ctrl+V');
    logger.info(`Terminal prompt generated for ${target}`);
  } catch (err) {
    logger.error('Failed to generate terminal prompt', err);
    vscode.window.showErrorMessage(`BugMode: ${String(err)}`);
  }
}

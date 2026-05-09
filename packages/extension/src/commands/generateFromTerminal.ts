import * as vscode from 'vscode';
import { analyzeError } from '@bugmode/core-engine';
import { extractProjectContext } from '@bugmode/parsers';
import { buildPrompt, PromptTarget } from '@bugmode/prompt-builder';
import { logger } from '../utils/logger';
import { BugModePanel } from '../panel/BugModePanel';

export async function runGenerateFromTerminal(target: PromptTarget, panel: BugModePanel): Promise<void> {
  // Read whatever is selected in the terminal via clipboard trick
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

    // Clear current terminal line and type the prompt
    const terminal = vscode.window.activeTerminal;
    if (terminal) {
      // Send Ctrl+C to cancel any partial input, then send the prompt
      terminal.sendText('', false); // focus
      await vscode.env.clipboard.writeText(prompt.content);
      // Clear line then paste prompt as new input
      terminal.sendText('\x15', false); // Ctrl+U clears the line
      terminal.sendText(prompt.content, false); // write prompt without executing
    }

    panel.showPrompt(prompt);
    logger.info(`Terminal prompt generated for ${target}`);
  } catch (err) {
    logger.error('Failed to generate terminal prompt', err);
    vscode.window.showErrorMessage(`BugMode: ${String(err)}`);
  }
}

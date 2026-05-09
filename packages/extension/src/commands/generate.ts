import * as vscode from 'vscode';
import { analyzeError } from '@bugmode/core-engine';
import { extractProjectContext } from '@bugmode/parsers';
import { buildPrompt, PromptTarget } from '@bugmode/prompt-builder';
import { copyToClipboard } from '../utils/clipboard';
import { logger } from '../utils/logger';
import { BugModePanel } from '../panel/BugModePanel';

export async function runGenerate(target: PromptTarget, panel: BugModePanel): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('BugMode: Open a file and select an error or stack trace first.');
    return;
  }

  const selection = editor.selection;
  const rawError = editor.document.getText(selection.isEmpty ? undefined : selection).trim();

  if (!rawError) {
    vscode.window.showWarningMessage('BugMode: No text selected. Select an error or stack trace.');
    return;
  }

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: 'BugMode: Analyzing...', cancellable: false },
    async () => {
      try {
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? process.cwd();

        logger.debug(`Analyzing error for target: ${target}`);
        const analysis = analyzeError(rawError);
        const projectContext = extractProjectContext(workspaceRoot, analysis.relatedFiles);

        const prompt = buildPrompt({
          rawError,
          analysis,
          projectContext,
          selectedCode: selection.isEmpty ? undefined : rawError,
          target,
        });

        panel.showPrompt(prompt);
        await copyToClipboard(prompt.content);

        vscode.window.showInformationMessage(
          `BugMode: Prompt generated for ${target} and copied to clipboard!`,
          'Show Output'
        ).then((choice) => {
          if (choice === 'Show Output') logger.show();
        });

        logger.info(`Generated prompt for ${target} — ${analysis.parsed.type}: ${analysis.parsed.message}`);
      } catch (err) {
        logger.error('Failed to generate prompt', err);
        vscode.window.showErrorMessage(`BugMode: Error — ${String(err)}`);
      }
    }
  );
}

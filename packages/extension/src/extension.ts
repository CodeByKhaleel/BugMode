import * as vscode from 'vscode';
import { BugModePanel } from './panel/BugModePanel';
import { runGenerate } from './commands/generate';
import { logger } from './utils/logger';

export function activate(context: vscode.ExtensionContext): void {
  logger.info('BugMode activated');

  const panel = new BugModePanel();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(BugModePanel.viewId, panel),

    vscode.commands.registerCommand('bugmode.generateForClaude', () =>
      runGenerate('claude', panel)
    ),
    vscode.commands.registerCommand('bugmode.generateForCursor', () =>
      runGenerate('cursor', panel)
    ),
    vscode.commands.registerCommand('bugmode.generateGeneric', () =>
      runGenerate('generic', panel)
    )
  );
}

export function deactivate(): void {
  logger.dispose();
}
